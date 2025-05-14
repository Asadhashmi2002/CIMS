import React, { useState, useEffect } from 'react';
import CreateBatchCard, { BatchData } from './CreateBatchCard';

interface Teacher {
  id: string;
  name: string;
  subject?: string;
  email?: string;
}

const BatchCardExample: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialValues, setInitialValues] = useState<BatchData | undefined>(undefined);
  const [createdBatches, setCreatedBatches] = useState<BatchData[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Mock data for teachers
  useEffect(() => {
    // Simulate API call to get teachers
    const fetchTeachers = async () => {
      setLoadingTeachers(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock teacher data
      const mockTeachers: Teacher[] = [
        { id: '1', name: 'Dr. Rajesh Kumar', subject: 'Physics', email: 'rajesh@example.com' },
        { id: '2', name: 'Mrs. Priya Sharma', subject: 'Chemistry', email: 'priya@example.com' },
        { id: '3', name: 'Mr. Ankit Patel', subject: 'Mathematics', email: 'ankit@example.com' },
        { id: '4', name: 'Dr. Neha Singh', subject: 'Biology', email: 'neha@example.com' },
        { id: '5', name: 'Prof. Suresh Gupta', subject: 'Computer Science', email: 'suresh@example.com' },
        { id: '6', name: 'Mrs. Anjali Desai', subject: 'English', email: 'anjali@example.com' },
        { id: '7', name: 'Dr. Mahesh Rao', subject: 'Economics', email: 'mahesh@example.com' },
      ];
      
      setTeachers(mockTeachers);
      setLoadingTeachers(false);
    };
    
    fetchTeachers();
  }, []);

  // Handle batch submission
  const handleSubmitBatch = async (batchData: BatchData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (isEditing) {
      // Update existing batch
      setCreatedBatches(prev => 
        prev.map(batch => batch.name === initialValues?.name ? batchData : batch)
      );
      setSuccessMessage(`Batch "${batchData.name}" updated successfully!`);
    } else {
      // Add new batch
      setCreatedBatches(prev => [...prev, batchData]);
      setSuccessMessage(`Batch "${batchData.name}" created successfully!`);
    }
    
    // Reset form state
    setShowForm(false);
    setIsEditing(false);
    setInitialValues(undefined);
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  // Handle batch edit
  const handleEditBatch = (batch: BatchData) => {
    setInitialValues(batch);
    setIsEditing(true);
    setShowForm(true);
  };

  // Handle batch delete
  const handleDeleteBatch = (batchName: string) => {
    if (window.confirm(`Are you sure you want to delete batch "${batchName}"?`)) {
      setCreatedBatches(prev => prev.filter(batch => batch.name !== batchName));
      setSuccessMessage(`Batch "${batchName}" deleted successfully!`);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
          <p className="mt-1 text-sm text-gray-500">Create and manage your teaching batches</p>
        </div>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Batch
          </button>
        )}
      </div>
      
      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative animate-fadeIn">
          <span className="block sm:inline">{successMessage}</span>
          <button 
            onClick={() => setSuccessMessage(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg className="fill-current h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </button>
        </div>
      )}
      
      {showForm ? (
        <div className="mb-10">
          <CreateBatchCard
            availableTeachers={teachers}
            onSubmit={handleSubmitBatch}
            onCancel={() => {
              setShowForm(false);
              setIsEditing(false);
              setInitialValues(undefined);
            }}
            initialValues={initialValues}
            isEditing={isEditing}
          />
        </div>
      ) : loadingTeachers ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* List of created batches */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {createdBatches.length > 0 ? (
                createdBatches.map((batch, index) => (
                  <li key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <h3 className="text-lg font-medium text-blue-600">{batch.name}</h3>
                        <p className="text-sm text-gray-500">Subject: {batch.subject}</p>
                        <p className="text-sm text-gray-500">Schedule: {batch.schedule}</p>
                        <p className="text-sm text-gray-500">
                          Teachers: {batch.teacherIds.length} assigned
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            batch.status === 'active' ? 'bg-green-100 text-green-800' :
                            batch.status === 'inactive' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                          </span>
                          {batch.maxStudents && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Max: {batch.maxStudents} students
                            </span>
                          )}
                          {batch.fees && batch.fees > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              ₹{batch.fees ? batch.fees.toLocaleString() : '0'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBatch(batch)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBatch(batch.name)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-12 sm:px-6 text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-lg font-medium">No batches created yet</p>
                  <p className="text-sm mt-1">Click "Create New Batch" to get started</p>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default BatchCardExample; 