import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { FaEdit, FaArrowLeft, FaCalendarAlt, FaUser, FaInfoCircle, FaCheck, FaTimes } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';

const LeaveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/leaves/${id}`);
        setLeave(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch leave details');
        setLoading(false);
      }
    };

    fetchLeave();
  }, [id]);

  const handleApprove = async () => {
    try {
      await axios.put(`/leaves/${id}`, { 
        status: 'Approved',
        admin_remarks: 'Approved by admin'
      });
      // Refresh leave data
      const response = await axios.get(`/leaves/${id}`);
      setLeave(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve leave request');
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(`/leaves/${id}`, { 
        status: 'Rejected',
        admin_remarks: 'Rejected by admin'
      });
      // Refresh leave data
      const response = await axios.get(`/leaves/${id}`);
      setLeave(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject leave request');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <div className="mt-4">
          <button 
            onClick={() => navigate('/leave-management')}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Leave Management
          </button>
        </div>
      </div>
    );
  }

  if (!leave) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700">Leave request not found</h2>
        <p className="text-gray-500 mt-2">The leave request you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/leave-management')}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Leave Management
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center">
            <FaCalendarAlt className="mr-3" />
            Leave Request Details
          </h1>
          <div className="flex space-x-2">
            {leave.status === 'Pending' && (
              <Link 
                to={`/leave-management/edit/${id}`} 
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaEdit className="mr-2" />
                Edit
              </Link>
            )}
            <Link 
              to="/leave-management" 
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <FaUser className="text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Employee Information</h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Name:</strong> {leave.user_name || 'Unknown'}</p>
            <p><strong>Employee ID:</strong> {leave.user_id}</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center mb-2">
            <FaCalendarAlt className="text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Leave Details</h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Leave Type:</strong> {leave.leave_type}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {leave.status || 'Pending'}
                </span>
              </p>
              <p><strong>From Date:</strong> {formatDate(leave.from_date)}</p>
              <p><strong>To Date:</strong> {formatDate(leave.to_date)}</p>
              <p><strong>Date of Request:</strong> {formatDate(leave.date_of_request)}</p>
              {leave.status_updated_at && (
                <p><strong>Status Updated:</strong> {formatDate(leave.status_updated_at)}</p>
              )}
            </div>
            <div className="mt-4">
              <p><strong>Reason:</strong></p>
              <p className="bg-white p-3 rounded border mt-1">{leave.reason}</p>
            </div>
            {leave.admin_remarks && (
              <div className="mt-4">
                <p><strong>Admin Remarks:</strong></p>
                <p className="bg-white p-3 rounded border mt-1">{leave.admin_remarks}</p>
              </div>
            )}
          </div>
        </div>

        {isAdmin && leave.status === 'Pending' && (
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleApprove}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaCheck className="mr-2" />
              Approve Leave
            </button>
            <button
              onClick={handleReject}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaTimes className="mr-2" />
              Reject Leave
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveDetail;