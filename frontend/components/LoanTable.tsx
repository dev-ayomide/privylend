'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loan } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface LoanTableProps {
  loans: Loan[];
  onRepay: (loanId: string, amount: number) => void;
}

export function LoanTable({ loans, onRepay }: LoanTableProps) {
  const [repaying, setRepaying] = useState<string | null>(null);

  const handleRepay = (loan: Loan) => {
    setRepaying(loan.id);
    setTimeout(() => {
      onRepay(loan.id, loan.totalOwed);
      setRepaying(null);
    }, 1000);
  };

  const getDaysRemaining = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (status: string, daysRemaining: number) => {
    if (status === 'Repaid') {
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200">
          Repaid
        </Badge>
      );
    }
    if (status === 'Defaulted') {
      return (
        <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
          Defaulted
        </Badge>
      );
    }
    if (daysRemaining < 30) {
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200">
          Due Soon
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-50 text-blue-700 border-blue-200">
        Active
      </Badge>
    );
  };

  if (loans.length === 0) {
    return (
      <div className="text-center py-12 text-slate-600">
        <p className="text-lg font-medium">No active loans</p>
        <p className="text-sm mt-2 text-slate-500">Request a loan to get started</p>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Principal</TableHead>
            <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Interest Rate</TableHead>
            <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Owed</TableHead>
            <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Due Date</TableHead>
            <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Days Left</TableHead>
            <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</TableHead>
            <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => {
            const daysRemaining = getDaysRemaining(loan.dueDate);
            return (
              <TableRow key={loan.id} className="hover:bg-slate-50">
                <TableCell className="font-medium text-slate-900 font-numeric">
                  {formatCurrency(loan.principal)}
                </TableCell>
                <TableCell className="text-slate-600 font-numeric">{loan.interestRate}%</TableCell>
                <TableCell className="font-semibold text-slate-900 font-numeric">
                  {formatCurrency(loan.totalOwed)}
                </TableCell>
                <TableCell className="text-slate-600">{formatDate(loan.dueDate)}</TableCell>
                <TableCell>
                  <span className={`${daysRemaining < 30 ? 'text-amber-600' : 'text-slate-600'} font-medium font-numeric`}>
                    {daysRemaining} days
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(loan.status, daysRemaining)}</TableCell>
                <TableCell>
                  {(loan.status === 'Active' || loan.status === 'Due Soon') && (
                    <Button
                      onClick={() => handleRepay(loan)}
                      disabled={repaying === loan.id}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {repaying === loan.id ? 'Processing...' : 'Repay Loan'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

