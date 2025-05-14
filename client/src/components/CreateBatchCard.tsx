import React, { useState, useEffect, useRef } from 'react';

interface Teacher {
  id: string;
  name: string;
  subject?: string;
  email?: string;
}

interface CreateBatchCardProps {
  availableTeachers: Teacher[];
  onSubmit: (batchData: BatchData) => Promise<void>;
  onCancel: () => void;
  initialValues?: BatchData;
  isEditing?: boolean;
}

export interface BatchData {
  name: string;
  subject: string;
  teacherIds: string[];
  schedule: string;
  maxStudents: number;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'upcoming';
  fees?: number;
}

const CreateBatchCard: React.FC<CreateBatchCardProps> = ({
  availableTeachers,
  onSubmit,
  onCancel,
  initialValues,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<BatchData>({
    name: '',
    subject: '',
    teacherIds: [],
    schedule: '',
    maxStudents: 30,
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active',
    fees: 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherSearchTerm, setTeacherSearchTerm] = useState('');
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const teacherDropdownRef = useRef<HTMLDivElement>(null);
  
  // Initialize form with initial values if provided
  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
      
      // Find selected teachers based on IDs
      const selected = availableTeachers.filter(teacher => 
        initialValues.teacherIds.includes(teacher.id)
      );
      setSelectedTeachers(selected);
    }
  }, [initialValues, availableTeachers]);
  
  // Close teacher dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (teacherDropdownRef.current && !teacherDropdownRef.current.contains(event.target as Node)) {
        setShowTeacherDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for number inputs
    if (name === 'maxStudents' || name === 'fees') {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setFormData(prev => ({ ...prev, [name]: numValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setIsFormDirty(true);
  };
  
  // Handle teacher selection
  const handleTeacherToggle = (teacher: Teacher) => {
    // Check if teacher is already selected
    const isSelected = selectedTeachers.some(t => t.id === teacher.id);
    
    if (isSelected) {
      // Remove teacher from selection
      setSelectedTeachers(prev => prev.filter(t => t.id !== teacher.id));
      setFormData(prev => ({
        ...prev,
        teacherIds: prev.teacherIds.filter(id => id !== teacher.id)
      }));
    } else {
      // Add teacher to selection
      setSelectedTeachers(prev => [...prev, teacher]);
      setFormData(prev => ({
        ...prev,
        teacherIds: [...prev.teacherIds, teacher.id]
      }));
    }
    
    setIsFormDirty(true);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Batch name is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (formData.teacherIds.length === 0) newErrors.teacherIds = 'At least one teacher must be selected';
    if (!formData.schedule.trim()) newErrors.schedule = 'Schedule is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to the first error
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      // Reset form after successful submission
      if (!isEditing) {
        setFormData({
          name: '',
          subject: '',
          teacherIds: [],
          schedule: '',
          maxStudents: 30,
          description: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          status: 'active',
          fees: 0
        });
        setSelectedTeachers([]);
      }
      setIsFormDirty(false);
    } catch (error) {
      console.error('Error submitting batch:', error);
      setErrors({
        submit: 'Failed to create batch. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Filter teachers based on search term
  const filteredTeachers = teacherSearchTerm.trim() === '' 
    ? availableTeachers 
    : availableTeachers.filter(teacher => 
        teacher.name.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
        (teacher.subject && teacher.subject.toLowerCase().includes(teacherSearchTerm.toLowerCase()))
      );
  
  // Handle form reset/cancel
  const handleCancel = () => {
    if (isFormDirty && !window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      return;
    }
    onCancel();
  };
  
  // Remove a selected teacher
  const removeSelectedTeacher = (teacherId: string) => {
    setSelectedTeachers(prev => prev.filter(t => t.id !== teacherId));
    setFormData(prev => ({
      ...prev,
      teacherIds: prev.teacherIds.filter(id => id !== teacherId)
    }));
    setIsFormDirty(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transform transition-all animate-slideInUp">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
        <h2 className="text-2xl font-bold text-white">
          {isEditing ? 'Edit Batch' : 'Create New Batch'}
        </h2>
        <p className="mt-1 text-blue-100">
          {isEditing ? 'Update batch information' : 'Set up a new batch with multiple teachers'}
        </p>
      </div>
      
      <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
        {errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shake-animation">
            {errors.submit}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Batch Name */}
          <div className="form-group col-span-1">
            <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
              Batch Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`input-field shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g. Physics 2023 Batch A"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          {/* Subject */}
          <div className="form-group col-span-1">
            <label htmlFor="subject" className="block text-gray-700 text-sm font-semibold mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={`input-field shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g. Physics, Mathematics, Chemistry"
            />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
          </div>
          
          {/* Teacher Multi-select */}
          <div className="form-group col-span-2 relative" ref={teacherDropdownRef}>
            <label htmlFor="teacherSearch" className="block text-gray-700 text-sm font-semibold mb-2">
              Assign Teachers <span className="text-red-500">*</span>
            </label>
            
            <div className="relative">
              <input
                type="text"
                id="teacherSearch"
                placeholder="Search teachers..."
                value={teacherSearchTerm}
                onChange={(e) => setTeacherSearchTerm(e.target.value)}
                onClick={() => setShowTeacherDropdown(true)}
                className={`input-field shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.teacherIds ? 'border-red-500' : 'border-gray-300'}`}
              />
              <span className="absolute right-3 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            
            {/* Selected teachers */}
            {selectedTeachers.length > 0 && (
              <div className="flex flex-wrap mt-2 gap-2">
                {selectedTeachers.map(teacher => (
                  <div key={teacher.id} className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                    {teacher.name}
                    <button 
                      type="button" 
                      onClick={() => removeSelectedTeacher(teacher.id)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {errors.teacherIds && <p className="text-red-500 text-xs mt-1">{errors.teacherIds}</p>}
            
            {/* Teacher dropdown */}
            {showTeacherDropdown && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                {filteredTeachers.length > 0 ? (
                  <ul className="py-1">
                    {filteredTeachers.map(teacher => (
                      <li key={teacher.id}>
                        <button
                          type="button"
                          onClick={() => handleTeacherToggle(teacher)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center ${
                            selectedTeachers.some(t => t.id === teacher.id) ? 'bg-blue-50' : ''
                          }`}
                        >
                          <span className="inline-block mr-2">
                            {selectedTeachers.some(t => t.id === teacher.id) ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                              </svg>
                            )}
                          </span>
                          <span className="flex-1">{teacher.name}</span>
                          {teacher.subject && <span className="text-xs text-gray-500">{teacher.subject}</span>}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">No teachers found</div>
                )}
              </div>
            )}
          </div>
          
          {/* Schedule */}
          <div className="form-group col-span-2">
            <label htmlFor="schedule" className="block text-gray-700 text-sm font-semibold mb-2">
              Schedule <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleInputChange}
              className={`input-field shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.schedule ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g. Mon, Wed, Fri 4:00 PM - 6:00 PM"
            />
            {errors.schedule && <p className="text-red-500 text-xs mt-1">{errors.schedule}</p>}
          </div>
          
          {/* Date Range */}
          <div className="form-group col-span-1">
            <label htmlFor="startDate" className="block text-gray-700 text-sm font-semibold mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className={`input-field shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
          </div>
          
          <div className="form-group col-span-1">
            <label htmlFor="endDate" className="block text-gray-700 text-sm font-semibold mb-2">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="input-field shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Maximum Students & Fees */}
          <div className="form-group col-span-1">
            <label htmlFor="maxStudents" className="block text-gray-700 text-sm font-semibold mb-2">
              Maximum Students
            </label>
            <input
              type="number"
              id="maxStudents"
              name="maxStudents"
              min="1"
              value={formData.maxStudents}
              onChange={handleInputChange}
              className="input-field shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="form-group col-span-1">
            <label htmlFor="fees" className="block text-gray-700 text-sm font-semibold mb-2">
              Fees (₹)
            </label>
            <input
              type="number"
              id="fees"
              name="fees"
              min="0"
              value={formData.fees}
              onChange={handleInputChange}
              className="input-field shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount in ₹"
            />
          </div>
          
          {/* Status */}
          <div className="form-group col-span-2">
            <label htmlFor="status" className="block text-gray-700 text-sm font-semibold mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="input-field shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
          
          {/* Description */}
          <div className="form-group col-span-2">
            <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="input-field shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter batch description, topics covered, etc."
            ></textarea>
          </div>
        </div>
        
        {/* Form buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{isEditing ? 'Update Batch' : 'Create Batch'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBatchCard; 