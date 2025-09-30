'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createItem } from '@/app/sell/actions';
import { CreateItemSchema } from '@/lib/validation';
import { z } from 'zod';

type FormData = z.infer<typeof CreateItemSchema>;

export function SellForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: 0,
  });
  const [errors, setErrors] = useState<z.ZodFormattedError<FormData> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(null);
    setIsSuccess(false);

    const result = CreateItemSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.format());
      setIsSubmitting(false);
      return;
    }

    try {
      await createItem(result.data);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error creating item:', error);
      // Handle server-side errors here, e.g., set a general error message
      setErrors({ _errors: ['Failed to create item.'], name: undefined, description: undefined, price: undefined });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors?.name?._errors && (
          <p className="mt-1 text-sm text-red-600">{errors.name._errors.join(', ')}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        ></textarea>
        {errors?.description?._errors && (
          <p className="mt-1 text-sm text-red-600">{errors.description._errors.join(', ')}</p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        {errors?.price?._errors && (
          <p className="mt-1 text-sm text-red-600">{errors.price._errors.join(', ')}</p>
        )}
      </div>

      {errors?._errors && (
        <p className="mt-1 text-sm text-red-600">{errors._errors.join(', ')}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
      >
        {isSubmitting ? 'Listing...' : 'List Item'}
      </button>

      {isSuccess && (
        <p className="mt-2 text-center text-green-600">Item listed successfully! Redirecting...</p>
      )}
    </form>
  );
}
