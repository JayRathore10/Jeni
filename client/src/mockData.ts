import { FileItem } from './types';

export const mockFiles: FileItem[] = [
  { id: 'f1', name: 'Product Launch', kind: 'folder', size: null, owner: 'You', modified: '2026-06-20T10:00:00Z', starred: true, shared: true, color: '#FF8A9D' },
  { id: 'f2', name: 'Engineering Specs', kind: 'folder', size: null, owner: 'You', modified: '2026-06-18T14:30:00Z', starred: false, shared: true, color: '#60A5FA' },
  { id: 'f3', name: 'Client Contracts', kind: 'folder', size: null, owner: 'Priya Shah', modified: '2026-06-15T09:15:00Z', starred: false, shared: false, color: '#FBBF24' },
  { id: 'f4', name: 'Design Assets', kind: 'folder', size: null, owner: 'You', modified: '2026-06-22T11:00:00Z', starred: true, shared: true, color: '#34D399' },
  { id: 'd1', name: 'Q3_Board_Deck.pdf', kind: 'pdf', size: 4400000, owner: 'You', modified: '2026-06-23T08:12:00Z', starred: true, shared: false },
  { id: 'd2', name: 'Brand_Guidelines_v3.pdf', kind: 'pdf', size: 8200000, owner: 'Arjun Mehta', modified: '2026-06-21T16:45:00Z', starred: false, shared: true },
  { id: 'd3', name: 'Onboarding_Flow.docx', kind: 'doc', size: 1100000, owner: 'You', modified: '2026-06-19T13:20:00Z', starred: false, shared: false },
  { id: 'd4', name: 'Revenue_Model.xlsx', kind: 'sheet', size: 2300000, owner: 'You', modified: '2026-06-17T09:00:00Z', starred: true, shared: true },
  { id: 'd5', name: 'Investor_Pitch.pptx', kind: 'slide', size: 15600000, owner: 'Priya Shah', modified: '2026-06-14T17:30:00Z', starred: false, shared: true },
  { id: 'd6', name: 'team_offsite.jpg', kind: 'image', size: 3800000, owner: 'You', modified: '2026-06-22T19:00:00Z', starred: false, shared: false },
  { id: 'd7', name: 'product_demo_final.mp4', kind: 'video', size: 184000000, owner: 'You', modified: '2026-06-20T12:00:00Z', starred: false, shared: true },
  { id: 'd8', name: 'standup_recording.mp3', kind: 'audio', size: 9400000, owner: 'Arjun Mehta', modified: '2026-06-16T08:30:00Z', starred: false, shared: false },
  { id: 'd9', name: 'website_assets.zip', kind: 'archive', size: 64000000, owner: 'You', modified: '2026-06-13T10:10:00Z', starred: false, shared: false },
  { id: 'd10', name: 'logo_final_v2.png', kind: 'image', size: 540000, owner: 'You', modified: '2026-06-23T07:45:00Z', starred: true, shared: false },
  { id: 'd11', name: 'Meeting_Notes_June.docx', kind: 'doc', size: 320000, owner: 'You', modified: '2026-06-24T06:00:00Z', starred: false, shared: false },
  { id: 'd12', name: 'Hiring_Plan_2026.xlsx', kind: 'sheet', size: 980000, owner: 'Priya Shah', modified: '2026-06-12T15:00:00Z', starred: false, shared: true },
];