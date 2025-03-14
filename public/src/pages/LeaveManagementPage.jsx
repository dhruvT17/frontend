import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaves, updateLeave, setCurrentLeave } from '../store/leaveStore';
import LeaveList from '../components/leave/LeaveList';
import LeaveForm from '../components/leave/LeaveForm';
import LeaveDetail from '../components/leave/LeaveDetail';
import { FaPlus, FaCalendarAlt } from 'react-icons/fa';
import { useUser } from '../context/UserContext';

const LeaveManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useUser();
  const { leaves, isLoading, error } = useSelector((state) => state.leaves);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    dispatch(fetchLeaves());
  }, [dispatch]);

  useEffect(() => {
    if (leaves) {
      if (isAdmin) {
        // Admin sees all leaves
        if (filterStatus === 'all') {
          setFilteredLeaves(leaves);
        } else {
          setFilteredLeaves(leaves.filter(leave => leave.status === filterStatus));
        }
      } else {
        // Regular users only see their own leaves
        const userLeaves = leaves.filter(leave => leave.user_id === user?.userId);
        if (filterStatus === 'all') {
          setFilteredLeaves(userLeaves);
        } else {
          setFilteredLeaves(userLeaves.filter(leave => leave.status === filterStatus));
        }
      }
    }
  }, [leaves, filterStatus, isAdmin, user]);

  const handleApproveLeave = (id) => {
    if (window.confirm('Are you sure you want to approve this leave request?')) {
      dispatch(updateLeave({ 
        id, 
        leaveData: { 
          status: 'Approved',
          admin_remarks: 'Approved by admin'
        } 
      }));
    }
  };

  const handleRejectLeave = (id) => {
    const remarks = window.prompt('Please provide a reason for rejection:');
    if (remarks) {
      dispatch(updateLeave({ 
        id, 
        leaveData: { 
          status: 'Rejected',
          admin_remarks: remarks
        } 
      }));
    }
  };

  const handleEditLeave = (leave) => {
    dispatch(setCurrentLeave(leave));
    navigate(`/leave-management/edit/${leave._id}`);
  };

  const MainContent = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <FaCalendarAlt className="mr-3 text-blue-600" />
          Leave Management
        </h1>
        {!isAdmin && (
          <Link
            to="/leave-management/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaPlus className="mr-2" />
            New Leave Request
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="filterStatus">
            Filter by Status:
          </label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="all">All Requests</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <LeaveList 
            leaves={filteredLeaves} 
            onEditLeave={handleEditLeave}
            onApproveLeave={handleApproveLeave}
            onRejectLeave={handleRejectLeave}
          />
        )}
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<MainContent />} />
      <Route path="/new" element={<LeaveForm />} />
      <Route path="/edit/:id" element={<LeaveForm isEditing={true} />} />
      <Route path="/view/:id" element={<LeaveDetail />} />
    </Routes>
  );
};

export default LeaveManagementPage;