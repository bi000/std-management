import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import studentService from '../../services/student.service';
import departmentService from '../../services/department.service';
import useToast from '../../hooks/useToast';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import getErrorMessage from '../../utils/getErrorMessage';

const EMPTY_FORM = {
  student_id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  gender: '',
  address: '',
  department_id: '',
  enrollment_date: '',
  status: 'Active',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Mirrors the backend's PHONE_PATTERN exactly, so an invalid phone is
// caught inline before the request round-trips to the server.
const PHONE_PATTERN = /^[0-9+()\-.\s]{7,20}$/;

function StudentForm() {
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
    studentService
      .getById(id)
      .then((student) =>
        setForm({
          student_id: student.student_id,
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email,
          phone: student.phone || '',
          // Dates come back as full ISO timestamps from MySQL; the
          // <input type="date"> control only accepts the YYYY-MM-DD prefix.
          date_of_birth: student.date_of_birth ? student.date_of_birth.slice(0, 10) : '',
          gender: student.gender || '',
          address: student.address || '',
          department_id: student.department_id || '',
          enrollment_date: student.enrollment_date ? student.enrollment_date.slice(0, 10) : '',
          status: student.status,
        })
      )
      .catch((err) => setLoadError(getErrorMessage(err, 'Unable to load student.')))
      .finally(() => setIsLoading(false));
  }, [id, isEditMode]);

  function validate() {
    const nextErrors = {};
    if (!form.student_id.trim()) nextErrors.student_id = 'Student ID is required.';
    if (!form.first_name.trim()) nextErrors.first_name = 'First name is required.';
    if (!form.last_name.trim()) nextErrors.last_name = 'Last name is required.';
    if (!form.email || !EMAIL_PATTERN.test(form.email)) nextErrors.email = 'A valid email is required.';
    if (form.phone && !PHONE_PATTERN.test(form.phone)) nextErrors.phone = 'Phone number format is invalid.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...form, department_id: form.department_id || null };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await studentService.update(id, payload);
        showToast('Student updated successfully');
      } else {
        await studentService.create(payload);
        showToast('Student created successfully');
      }
      navigate('/students');
    } catch (err) {
      showToast(getErrorMessage(err, 'Unable to save student.'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-900">
        {isEditMode ? 'Edit student' : 'Add student'}
      </h1>

      <ErrorMessage message={loadError} className="mb-4" />

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-ink-100 bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="student_id"
            label="Student ID"
            value={form.student_id}
            error={errors.student_id}
            onChange={(e) => setForm({ ...form, student_id: e.target.value })}
            placeholder="STU-2024-001"
          />
          <Select
            id="status"
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="first_name"
            label="First name"
            value={form.first_name}
            error={errors.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />
          <Input
            id="last_name"
            label="Last name"
            value={form.last_name}
            error={errors.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />
        </div>

        <Input
          id="email"
          label="Email"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="student@school.edu"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="phone"
            label="Phone"
            value={form.phone}
            error={errors.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="555-0101"
          />
          <Input
            id="date_of_birth"
            label="Date of birth"
            type="date"
            value={form.date_of_birth}
            onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="gender"
            label="Gender"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Not specified</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
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
        </div>

        <Input
          id="address"
          label="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <Input
          id="enrollment_date"
          label="Enrollment date"
          type="date"
          value={form.enrollment_date}
          onChange={(e) => setForm({ ...form, enrollment_date: e.target.value })}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/students')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditMode ? 'Save changes' : 'Create student'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StudentForm;
