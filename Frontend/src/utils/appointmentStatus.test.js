import test from 'node:test'
import assert from 'node:assert/strict'
import { getAppointmentStatusMeta } from './appointmentStatus.js'

test('maps pending to the expected label and style', () => {
  const meta = getAppointmentStatusMeta('PENDING')
  assert.equal(meta.label, 'Pending')
  assert.equal(meta.badgeClass, 'status-pending')
  assert.match(meta.message, /waiting for approval/i)
})

test('maps cancelled to its own label with a red style', () => {
  const meta = getAppointmentStatusMeta('CANCELLED')
  assert.equal(meta.label, 'Cancelled')
  assert.equal(meta.badgeClass, 'status-cancelled')
})

test('maps rescheduled to the expected orange style', () => {
  const meta = getAppointmentStatusMeta('RESCHEDULED')
  assert.equal(meta.label, 'Rescheduled')
  assert.equal(meta.badgeClass, 'status-rescheduled')
})
