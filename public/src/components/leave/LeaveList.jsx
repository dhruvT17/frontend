import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteLeave, setCurrentLeave } from '../../store/leaveStore';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';

const LeaveList = ({ leaves, onEditLeave, onApproveLeave, onRejectLeave }) => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const isAdmin = user?.role === 'Admin';

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      dispatch(deleteLeave(id));
    }
  };

  const handleEdit = (leave) => {
    dispatch(setCurrentLeave(leave));
    if (onEditLeave) {
      onEditLeave(leave);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left">Employee</th>
            <th className="py-3 px-4 text-left">Leave Type</th>
            <th className="py-3 px-4 text-left">From</th>
            <th className="py-3 px-4 text-left">To</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leaves && leaves.length > 0 ? (
            leaves.map((leave) => (
              <tr key={leave._id} className="hover:bg-gray-50">
                <td className="py-3 px-4">{leave.user_name || 'Unknown'}</td>
                <td className="py-3 px-4">{leave.leave_type}</td>
                <td className="py-3 px-4">{formatDate(leave.from_date)}</td>
                <td className="py-3 px-4">{formatDate(leave.to_date)}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(leave.status)}`}>
                    {leave.status || 'Pending'}
                  </span>
                </td>
                <td className="py-3 px-4 flex space-x-2">
                  <Link 
                    to={`/leave-management/view/${leave._id}`} 
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEye />
                  </Link>
                  
                  {(leave.status === 'Pending' || isAdmin) && (
                    <Link 
                      to={`/leave-management/edit/${leave._id}`} 
                      className="text-yellow-500 hover:text-yellow-700"
                      onClick={() => handleEdit(leave)}
                    >
                      <FaEdit />
                    </Link>
                  )}
                  
                  {(leave.status === 'Pending' || isAdmin) && (
                    <button 
                      onClick={() => handleDelete(leave._id)} 
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                  
                  {isAdmin && leave.status === 'Pending' && (
                    <>
                      <button 
                        onClick={() => onApproveLeave && onApproveLeave(leave._id)} 
                        className="text-green-500 hover:text-green-700"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        onClick={() => onRejectLeave && onRejectLeave(leave._id)} 
                        className="text-red-500 hover:text-red-700"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-6 text-center text-gray-500">
                No leave requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveList;