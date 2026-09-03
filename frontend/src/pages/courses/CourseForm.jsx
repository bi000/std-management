import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import courseService from '../../services/course.service';
import departmentService from '../../services/department.service';
import useToast from '../../hooks/useToast';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import getErrorMessage from '../../utils/getErrorMessage';

const EMPTY_FORM = { course_code: '', course_name: '', description: '', credit_hours: '', department_id: '' };

function CourseForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    departmentService.getAll({ limit: 100 }).then((res) => setDepartments(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    courseService
      .getById(id)
      .then((course) =>
        setForm({
          course_code: course.course_code,
          course_name: course.course_name,
          description: course.description || '',
          credit_hours: course.credit_hours,
          department_id: course.department_id || '',
        })
      )
      .catch((err) => setLoadError(getErrorMessage(err, 'Unable to load course.')))
      .finally(() => setIsLoading(false));
  }, [id, isEditMode]);

  function validate() {
    const nextErrors = {};
    if (!form.course_code.trim()) nextErrors.course_code = 'Course code is required.';
    if (!form.course_name.trim()) nextErrors.course_name = 'Course name is required.';
    const hours = Number(form.credit_hours);
    if (!Number.isInteger(hours) || hours < 1 || hours > 10) {
      nextErrors.credit_hours = 'Credit hours must be a whole number between 1 and 10.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...form, credit_hours: Number(form.credit_hours), department_id: form.department_id || null };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await courseService.update(id, payload);
        showToast('Course updated successfully');
      } else {
        await courseService.create(payload);
        showToast('Course created successfully');
      }
      navigate('/courses');
    } catch (err) {
      showToast(getErrorMessage(err, 'Unable to save course.'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-900">
        {isEditMode ? 'Edit course' : 'Add course'}
      </h1>

      <ErrorMessage message={loadError} className="mb-4" />

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-ink-100 bg-white p-6">
        <Input
          id="course_code"
          label="Course code"
          value={form.course_code}
          error={errors.course_code}
          onChange={(e) => setForm({ ...form, course_code: e.target.value })}
          placeholder="CS101"
        />
        <Input
          id="course_name"
          label="Course name"
          value={form.course_name}
          error={errors.course_name}
          onChange={(e) => setForm({ ...form, course_name: e.target.value })}
          placeholder="Introduction to Programming"
        />
        <Textarea
          id="description"
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Input
          id="credit_hours"
          label="Credit hours"
          type="number"
          min={1}
          max={10}
          value={form.credit_hours}
          error={errors.credit_hours}
          onChange={(e) => setForm({ ...form, credit_hours: e.target.value })}
        />
        <Select
          id="department_id"
          label="Department"
          value={form.department_id}
          onChange={(e) => setForm({ ...form, department_id: e.target.value })}
        >
          <option value="">Select a department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </Select>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/courses')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditMode ? 'Save changes' : 'Create course'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm;
