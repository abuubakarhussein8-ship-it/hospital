const normalizeStatus = (value) => String(value || '').toUpperCase()

export const getAppointmentStatusMeta = (status) => {
  const normalized = normalizeStatus(status)

  switch (normalized) {
    case 'APPROVED':
      return {
        label: 'Approved',
        badgeClass: 'status-approved',
        message: 'Your appointment has been confirmed.',
        accent: 'Approved',
      }
    case 'COMPLETED':
      return {
        label: 'Completed',
        badgeClass: 'status-completed',
        message: 'Your appointment has been completed.',
        accent: 'Completed',
      }
    case 'REJECTED':
      return {
        label: 'Rejected',
        badgeClass: 'status-cancelled',
        message: 'Your appointment was not approved.',
        accent: 'Rejected',
      }
    case 'CANCELLED':
      return {
        label: 'Cancelled',
        badgeClass: 'status-cancelled',
        message: 'Your appointment was cancelled.',
        accent: 'Cancelled',
      }
    case 'RESCHEDULED':
      return {
        label: 'Rescheduled',
        badgeClass: 'status-rescheduled',
        message: 'Your appointment has been rescheduled.',
        accent: 'Rescheduled',
      }
    case 'PENDING':
    default:
      return {
        label: 'Pending',
        badgeClass: 'status-pending',
        message: 'Your appointment is waiting for approval.',
        accent: 'Pending',
      }
  }
}
