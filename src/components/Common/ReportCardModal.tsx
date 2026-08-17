import React from 'react';
import { ExamResultItem } from '../../types';
import { StudentSummaryPDFModal } from '../Exams/StudentSummaryPDFModal';

interface ReportCardModalProps {
  result: ExamResultItem;
  allResults?: ExamResultItem[];
  onSelectStudent?: (result: ExamResultItem) => void;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  result,
  allResults,
  onSelectStudent,
  onClose
}) => {
  return (
    <StudentSummaryPDFModal
      result={result}
      allResults={allResults}
      onSelectStudent={onSelectStudent}
      onClose={onClose}
    />
  );
};
