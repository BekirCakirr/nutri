import type { Message, Conversation } from '@/types';

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'diet-1',
    receiverId: 'user-1',
    content: 'Merhaba Ay\u015fe Han\u0131m, haftal\u0131k plan\u0131n\u0131z\u0131 g\u00f6nderdim. L\u00fctfen inceleyip sorular\u0131n\u0131z\u0131 iletin.',
    type: 'text',
    timestamp: '2026-02-25T09:00:00Z',
    read: true,
  },
  {
    id: 'msg-2',
    senderId: 'user-1',
    receiverId: 'diet-1',
    content: 'Te\u015fekk\u00fcrler Zeynep Han\u0131m! Plan\u0131 inceliyorum. Kahvalt\u0131da yumurta yerine ne koyabilirim?',
    type: 'text',
    timestamp: '2026-02-25T09:15:00Z',
    read: true,
  },
  {
    id: 'msg-3',
    senderId: 'diet-1',
    receiverId: 'user-1',
    content: 'Yumurta yerine lor peyniri veya avokado tercih edebilirsiniz. \u0130kisinde de iyi protein ve sa\u011fl\u0131kl\u0131 ya\u011f var.',
    type: 'text',
    timestamp: '2026-02-25T09:20:00Z',
    read: true,
  },
  {
    id: 'msg-4',
    senderId: 'user-1',
    receiverId: 'diet-1',
    content: 'Anlad\u0131m, \u00e7ok te\u015fekk\u00fcrler! Bir de ak\u015fam spor sonras\u0131 ne yememi \u00f6nerirsiniz?',
    type: 'text',
    timestamp: '2026-02-25T09:30:00Z',
    read: false,
  },
  {
    id: 'msg-5',
    senderId: 'diet-1',
    receiverId: 'user-1',
    content: 'Spor sonras\u0131 protein a\u011f\u0131rl\u0131kl\u0131 bir \u00f6\u011f\u00fcn ideal olur. \u0130zgara tavuk + salata veya yo\u011furt + meyve gibi.',
    type: 'text',
    timestamp: '2026-02-25T09:35:00Z',
    read: false,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: ['user-1', 'diet-1'],
    lastMessage: mockMessages[mockMessages.length - 1],
    unreadCount: 2,
    updatedAt: '2026-02-25T09:35:00Z',
  },
];
