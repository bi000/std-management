import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import departmentService from '../../services/department.service';
import useToast from '../../hooks/useToast';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import getErrorMessage from '../../utils/getErrorMessage';

// Handles both "Add Department" and "Edit Department" — the only
// difference is whether an `id` is present in the URL, so one form
// component avoids duplicating the same fields and validation twice.
function DepartmentForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!isEditMode) return;
    departmentService
      .getById(id)
      .then((department) => setForm({ name: department.name, description: department.description || '' }))
      .catch((err) => setLoadError(getErrorMessage(err, 'Unable to load department.')))
      .finally(() => setIsLoading(false));
  }, [id, isEditMode]);

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Department name is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await departmentService.update(id, form);
        showToast('Department updated successfully');
      } else {
        await departmentService.create(form);
        showToast('Department created successfully');
      }
      navigate('/departments');
    } catch (err) {
      showToast(getErrorMessage(err, 'Unable to save department.'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-900">
        {isEditMode ? 'Edit department' : 'Add department'}
      </h1>

      <ErrorMessage message={loadError} className="mb-4" />

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-ink-100 bg-white p-6">
        <Input
          id="name"
          label="Name"
          value={form.name}
          error={errors.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Computer Science"
        />
        <Textarea
          id="description"
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="A short description of the department"
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/departments')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditMode ? 'Save changes' : 'Create department'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default DepartmentForm;
