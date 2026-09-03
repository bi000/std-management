import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userService from '../../services/user.service';
import useToast from '../../hooks/useToast';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import getErrorMessage from '../../utils/getErrorMessage';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'Staff', status: 'Active' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function UserForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!isEditMode) return;
    userService
      .getById(id)
      // Password is never returned by the API and isn't editable
      // through this form — changing it is a separate, more
      // sensitive operation outside this project's scope.
      .then((u) => setForm({ name: u.name, email: u.email, password: '', role: u.role, status: u.status }))
      .catch((err) => setLoadError(getErrorMessage(err, 'Unable to load user.')))
      .finally(() => setIsLoading(false));
  }, [id, isEditMode]);

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!form.email || !EMAIL_PATTERN.test(form.email)) nextErrors.email = 'A valid email is required.';
    if (!isEditMode && (!form.password || form.password.length < 8)) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await userService.update(id, { name: form.name, email: form.email, role: form.role, status: form.status });
        showToast('User updated successfully');
      } else {
        await userService.create(form);
        showToast('User created successfully');
      }
      navigate('/users');
    } catch (err) {
      showToast(getErrorMessage(err, 'Unable to save user.'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-900">
        {isEditMode ? 'Edit user' : 'Add user'}
      </h1>

      <ErrorMessage message={loadError} className="mb-4" />

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-ink-100 bg-white p-6">
        <Input
          id="name"
          label="Name"
          value={form.name}
          error={errors.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {!isEditMode && (
          <Input
            id="password"
            label="Password"
            type="password"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="At least 8 characters"
          />
        )}
        <div className="grid grid-cols-2 gap-4">
          <Select id="role" label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </Select>
          <Select
            id="status"
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/users')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditMode ? 'Save changes' : 'Create user'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
