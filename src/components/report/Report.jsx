import React, { useEffect } from 'react';
import DataExportComponent from './DataExportComponent';
import PinReport from './PinReport';
import { getAdminReports } from '../../actions/reports';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './Loader';
import { newMembers } from '../../actions/newMembers';
import NewJoinedMember from './newJoinedMember';
import { highPerforming } from '../../actions/highPerformingCustomer';
import HighPerformingTeam from './HighPerformingTeam';
import { pendingcommission } from '../../actions/pendingCommissionReport';
import DataTableReport from './DataTableReport';
import CommissionPaid from './CommissionPaid';


const CombinedComponent = () => {
const dispatch = useDispatch()
  const adminId = useSelector((state)=> state.auth?.authData?.admin?.username)
  const adminReports = useSelector((state)=> state.reports.adminReports)
  const newMembersReports = useSelector((state) => state.newMembers);
  
  const highPerformanceReports = useSelector((state) => state.highPerformingCustomer);

  useEffect(() => {
    if (adminId) {
      dispatch(highPerforming(adminId));
    }
  }, [dispatch, adminId]);


      useEffect(() => {
        dispatch(newMembers());
      }, [dispatch]);


  useEffect(() => {
    dispatch(getAdminReports(adminId))
  }, [adminId])




  const isEmpty = (obj) => Object.keys(obj).length === 0;
  const isLoading = isEmpty(adminReports) || isEmpty(newMembersReports) //|| isEmpty(highPerformanceReports);

  return (
    <div className="flex space-x-4 p-4">
      <div className="w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataExportComponent adminReports={adminReports} />
          <DataTableReport data = {adminReports?.RegistrationPin["Registration pin report"]} header = "Registration Pin Report"/>
          <DataTableReport data = {adminReports?.["Product Sale"]["Product report"]} header = "Product Sale Report"/>
          <DataTableReport data = {adminReports?.["commission report"]["commission Report"]} header = "Commission Pending Report"/>
          <CommissionPaid/>
          <NewJoinedMember newMembers={newMembersReports} />
          <HighPerformingTeam highPerforming={highPerformanceReports} />
         
        </>
      )}
    </div>
    </div>
  );
};

export default CombinedComponent;
