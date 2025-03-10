import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLeave, updateLeave, clearCurrentLeave } from '../../store/leaveStore';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const LeaveForm = ({ isEditing = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useUser();
  const { currentLeave, isLoading, error } = useSelector((state) => state.leaves);

  const [formData, setFormData] = useState({
    user_id: user?.userId || '',
    from_date: '',
    to_date: '',
    leave_type: 'Annual',
    reason: ''
  });

  useEffect(() => {
    if (isEditing && currentLeave) {
      setFormData({
        user_id: currentLeave.user_id || user?.userId || '',
        from_date: currentLeave.from_date ? new Date(currentLeave.from_date).toISOString().split('T')[0] : '',
        to_date: currentLeave.to_date ? new Date(currentLeave.to_date).toISOString().split('T')[0] : '',
        leave_type: currentLeave.leave_type || 'Annual',
        reason: currentLeave.reason || ''
      });
    }

    return () => {
      if (isEditing) {
        dispatch(clearCurrentLeave());
      }
    };
  }, [isEditing, currentLeave, dispatch, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isEditing && currentLeave) {
      await dispatch(updateLeave({ id: currentLeave._id, leaveData: formData }));
    } else {
      await dispatch(createLeave(formData));
    }
    
    if (!error) {
      navigate('/leave-management');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Leave Request' : 'Create New Leave Request'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="from_date">
              From Date
            </label>
            <input
              type="date"
              id="from_date"
              name="from_date"
              value={formData.from_date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="to_date">
              To Date
            </label>
            <input
              type="date"
              id="to_date"
              name="to_date"
              value={formData.to_date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="leave_type">
              Leave Type
            </label>
            <select
              id="leave_type"
              name="leave_type"
              value={formData.leave_type}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="Annual">Annual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Personal">Personal Leave</option>
              <option value="Unpaid">Unpaid Leave</option>
            </select>
          </div>
          
          <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
              required
            ></textarea>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : isEditing ? 'Update Leave Request' : 'Submit Leave Request'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/leave-management')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;