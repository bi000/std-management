import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import enrollmentService from '../../services/enrollment.service';
import studentService from '../../services/student.service';
import courseService from '../../services/course.service';
import useToast from '../../hooks/useToast';
import Select from '../../components/Select';
import Input from '../../components/Input';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import getErrorMessage from '../../utils/getErrorMessage';

const EMPTY_FORM = {
  student_id: '',
  course_id: '',
  enrollment_date: new Date().toISOString().slice(0, 10),
  semester: 'Fall',
  academic_year: '',
  status: 'Active',
};

// Spec lists only "Add Enrollment" (no separate Edit page) — status
// and date changes after creation are handled on the Enrollment
// Details page instead, via the same PUT endpoint.
function EnrollmentForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([studentService.getAll({ limit: 100 }), courseService.getAll({ limit: 100 })])
      .then(([studentsRes, coursesRes]) => {
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  function validate() {
    const nextErrors = {};
    if (!form.student_id) nextErrors.student_id = 'Select a student.';
    if (!form.course_id) nextErrors.course_id = 'Select a course.';
    if (!form.enrollment_date) nextErrors.enrollment_date = 'Enrollment date is required.';
    if (!/^\d{4}-\d{4}$/.test(form.academic_year)) {
      nextErrors.academic_year = 'Format must be YYYY-YYYY, e.g. 2024-2025.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await enrollmentService.create(form);
      showToast('Enrollment created successfully');
      navigate('/enrollments');
    } catch (err) {
      // Surfaces the backend's specific message, e.g. the duplicate-
      // enrollment conflict, rather than a generic failure notice.
      showToast(getErrorMessage(err, 'Unable to create enrollment.'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-900">Add enrollment</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-ink-100 bg-white p-6">
        <Select
          id="student_id"
          label="Student"
          value={form.student_id}
          error={errors.student_id}
          onChange={(e) => setForm({ ...form, student_id: e.target.value })}
        >
          <option value="">Select a student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.student_id} — {s.first_name} {s.last_name}
            </option>
          ))}
        </Select>

        <Select
          id="course_id"
          label="Course"
          value={form.course_id}
          error={errors.course_id}
          onChange={(e) => setForm({ ...form, course_id: e.target.value })}
        >
          <option value="">Select a course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.course_code} — {c.course_name}
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="semester"
            label="Semester"
            value={form.semester}
            onChange={(e) => setForm({ ...form, semester: e.target.value })}
          >
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
          </Select>
          <Input
            id="academic_year"
            label="Academic year"
            value={form.academic_year}
            error={errors.academic_year}
            onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
            placeholder="2024-2025"
          />
        </div>

        <Input
          id="enrollment_date"
          label="Enrollment date"
          type="date"
          value={form.enrollment_date}
          error={errors.enrollment_date}
          onChange={(e) => setForm({ ...form, enrollment_date: e.target.value })}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/enrollments')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create enrollment
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EnrollmentForm;
