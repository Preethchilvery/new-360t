import React, { useState } from 'react';
import InvestigationFlowchart from '../components/InvestigationFlowchart';

const InvestigationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <InvestigationFlowchart />
    </div>
  );
};

export default InvestigationPage; 