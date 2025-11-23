
export interface ModalDemo {
  title: string;
  description: string;
  route: string;
  color: string;
}

export const modalDemos: ModalDemo[] = [
  {
    title: 'Standard Modal',
    description: 'A full-screen modal presentation',
    route: '/modal',
    color: '#2196F3',
  },
  {
    title: 'Form Sheet',
    description: 'A card-style modal with adjustable heights',
    route: '/formsheet',
    color: '#4CAF50',
  },
  {
    title: 'Transparent Modal',
    description: 'A modal with transparent background',
    route: '/transparent-modal',
    color: '#FF9800',
  },
];
