import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import Icon from '@/components/ui/icon';

interface User {
  username: string;
  password: string;
  avatar?: string;
  bio?: string;
  status: 'online' | 'offline' | 'away';
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  edited?: boolean;
  attachments?: string[];
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  type: 'chat' | 'group' | 'channel';
  messages: Message[];
  members?: string[];
  description?: string;
}

interface Contact {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'away';
  avatar: string;
  blocked?: boolean;
  lastSeen?: Date;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Александр Петров',
      lastMessage: 'Привет! Как дела?',
      time: '14:32',
      unread: 2,
      avatar: 'АП',
      type: 'chat',
      messages: [
        { id: 'm1', senderId: '1', text: 'Привет! Как дела?', timestamp: new Date() },
        { id: 'm2', senderId: 'current', text: 'Отлично! Работаю над новым проектом', timestamp: new Date() }
      ]
    },
    {
      id: '2',
      name: 'Мария Иванова',
      lastMessage: 'Отправила файл',
      time: '13:15',
      unread: 0,
      avatar: 'МИ',
      type: 'chat',
      messages: [
        { id: 'm3', senderId: '2', text: 'Отправила файл с документацией', timestamp: new Date() }
      ]
    },
    {
      id: '3',
      name: 'Разработчики',
      lastMessage: 'Дмитрий: Завтра созвон в 10:00',
      time: '12:45',
      unread: 5,
      avatar: 'Р',
      type: 'group',
      members: ['Дмитрий', 'Алексей', 'Ирина'],
      description: 'Группа для обсуждения проектов',
      messages: [
        { id: 'm4', senderId: '3', text: 'Завтра созвон в 10:00', timestamp: new Date() }
      ]
    },
    {
      id: '4',
      name: 'Новости IT',
      lastMessage: 'Выпуск новой версии React',
      time: 'вчера',
      unread: 0,
      avatar: 'IT',
      type: 'channel',
      description: 'Канал с новостями технологий',
      messages: [
        { id: 'm5', senderId: 'admin', text: 'Выпуск новой версии React с улучшениями производительности', timestamp: new Date() }
      ]
    },
    {
      id: '5',
      name: 'Проект Alpha',
      lastMessage: 'Обновлена документация',
      time: 'вчера',
      unread: 1,
      avatar: 'PA',
      type: 'group',
      members: ['Сергей', 'Ольга'],
      messages: []
    }
  ]);

  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Александр Петров', status: 'online', avatar: 'АП' },
    { id: '2', name: 'Мария Иванова', status: 'offline', avatar: 'МИ', lastSeen: new Date() },
    { id: '3', name: 'Дмитрий Сидоров', status: 'online', avatar: 'ДС' },
    { id: '4', name: 'Елена Козлова', status: 'away', avatar: 'ЕК' },
    { id: '5', name: 'Игорь Смирнов', status: 'online', avatar: 'ИС', blocked: true }
  ]);

  const [settings, setSettings] = useState({
    notifications: true,
    readReceipts: true,
    lastSeen: true,
    profilePhoto: true,
    autoDownload: false,
    darkMode: true
  });

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [createChatOpen, setCreateChatOpen] = useState(false);
  const [blockedUsersOpen, setBlockedUsersOpen] = useState(false);
  const [chatInfoOpen, setChatInfoOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [newChatType, setNewChatType] = useState<'group' | 'channel'>('group');
  const [searchInChat, setSearchInChat] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setContacts(prev => prev.map(contact => ({
        ...contact,
        status: contact.blocked ? contact.status : (['online', 'offline', 'away'] as const)[Math.floor(Math.random() * 3)]
      })));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = () => {
    if (!username || !password) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }
    setCurrentUser({ username, password, status: 'online', bio: 'Новый пользователь' });
    setIsLoggedIn(true);
    toast({ title: 'Успешно', description: `Добро пожаловать, ${username}!` });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const chat = chats.find(c => c.id === selectedChat);
    if (!chat) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: 'current',
      text: message,
      timestamp: new Date()
    };

    setChats(prev => prev.map(c => {
      if (c.id === selectedChat) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: message,
          time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return c;
    }));

    setMessage('');
    toast({ title: 'Отправлено', description: 'Сообщение доставлено' });
  };

  const handleDeleteMessage = (messageId: string) => {
    setChats(prev => prev.map(c => {
      if (c.id === selectedChat) {
        return {
          ...c,
          messages: c.messages.filter(m => m.id !== messageId)
        };
      }
      return c;
    }));
    toast({ title: 'Удалено', description: 'Сообщение удалено' });
  };

  const handleEditMessage = (messageId: string, newText: string) => {
    setChats(prev => prev.map(c => {
      if (c.id === selectedChat) {
        return {
          ...c,
          messages: c.messages.map(m => m.id === messageId ? { ...m, text: newText, edited: true } : m)
        };
      }
      return c;
    }));
    setEditingMessageId(null);
    toast({ title: 'Изменено', description: 'Сообщение отредактировано' });
  };

  const handleBlockUser = (contactId: string) => {
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, blocked: !c.blocked } : c));
    const contact = contacts.find(c => c.id === contactId);
    toast({
      title: contact?.blocked ? 'Разблокирован' : 'Заблокирован',
      description: `${contact?.name} ${contact?.blocked ? 'разблокирован' : 'заблокирован'}`
    });
  };

  const handleCreateChat = () => {
    if (!newChatName.trim()) {
      toast({ title: 'Ошибка', description: 'Введите название', variant: 'destructive' });
      return;
    }

    const newChat: Chat = {
      id: `${Date.now()}`,
      name: newChatName,
      lastMessage: 'Чат создан',
      time: 'сейчас',
      unread: 0,
      avatar: newChatName.substring(0, 2).toUpperCase(),
      type: newChatType,
      messages: [],
      members: newChatType === 'group' ? [currentUser?.username || ''] : undefined
    };

    setChats(prev => [newChat, ...prev]);
    setNewChatName('');
    setCreateChatOpen(false);
    toast({ title: 'Создано', description: `${newChatType === 'group' ? 'Группа' : 'Канал'} "${newChatName}" создан` });
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (selectedChat === chatId) setSelectedChat(null);
    toast({ title: 'Удалено', description: 'Чат удален' });
  };

  const currentChat = chats.find(c => c.id === selectedChat);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = currentChat?.messages.filter(msg =>
    msg.text.toLowerCase().includes(searchInChat.toLowerCase())
  ) || [];

  const totalMessages = chats.reduce((acc, chat) => acc + chat.messages.length, 0);
  const unreadCount = chats.reduce((acc, chat) => acc + chat.unread, 0);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-8 space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Icon name="MessageSquare" size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Мессенджер</h1>
            <p className="text-muted-foreground">
              {isRegistering ? 'Создайте аккаунт' : 'Войдите в систему'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                placeholder="Введите имя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              />
            </div>

            <Button onClick={handleAuth} className="w-full" size="lg">
              {isRegistering ? 'Зарегистрироваться' : 'Войти'}
            </Button>

            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Мессенджер</h2>
            <div className="flex items-center gap-1">
              <Dialog open={createChatOpen} onOpenChange={setCreateChatOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Icon name="Plus" size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Создать чат</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Тип</Label>
                      <Select value={newChatType} onValueChange={(v) => setNewChatType(v as 'group' | 'channel')}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="group">Группа</SelectItem>
                          <SelectItem value="channel">Канал</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Название</Label>
                      <Input
                        placeholder="Введите название"
                        value={newChatName}
                        onChange={(e) => setNewChatName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateChat}>Создать</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Icon name="Settings" size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Настройки</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[500px] pr-4">
                    <div className="space-y-6 py-4">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Профиль</h3>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                              {currentUser?.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold">{currentUser?.username}</p>
                            <p className="text-sm text-muted-foreground">{currentUser?.bio || 'Нет описания'}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setEditProfileOpen(true)}>
                            <Icon name="Edit" size={16} />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Статистика</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="p-3">
                            <p className="text-xs text-muted-foreground">Чатов</p>
                            <p className="text-2xl font-bold">{chats.length}</p>
                          </Card>
                          <Card className="p-3">
                            <p className="text-xs text-muted-foreground">Сообщений</p>
                            <p className="text-2xl font-bold">{totalMessages}</p>
                          </Card>
                          <Card className="p-3">
                            <p className="text-xs text-muted-foreground">Контактов</p>
                            <p className="text-2xl font-bold">{contacts.length}</p>
                          </Card>
                          <Card className="p-3">
                            <p className="text-xs text-muted-foreground">Непрочитано</p>
                            <p className="text-2xl font-bold">{unreadCount}</p>
                          </Card>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Приватность</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Уведомления</Label>
                            <Switch checked={settings.notifications} onCheckedChange={(v) => setSettings({ ...settings, notifications: v })} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Статус прочтения</Label>
                            <Switch checked={settings.readReceipts} onCheckedChange={(v) => setSettings({ ...settings, readReceipts: v })} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Время посещения</Label>
                            <Switch checked={settings.lastSeen} onCheckedChange={(v) => setSettings({ ...settings, lastSeen: v })} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Показывать фото</Label>
                            <Switch checked={settings.profilePhoto} onCheckedChange={(v) => setSettings({ ...settings, profilePhoto: v })} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Автозагрузка медиа</Label>
                            <Switch checked={settings.autoDownload} onCheckedChange={(v) => setSettings({ ...settings, autoDownload: v })} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" onClick={() => setBlockedUsersOpen(true)}>
                          <Icon name="Shield" size={18} className="mr-2" />
                          Заблокированные ({contacts.filter(c => c.blocked).length})
                        </Button>
                        <Button variant="destructive" className="w-full justify-start" onClick={() => setIsLoggedIn(false)}>
                          <Icon name="LogOut" size={18} className="mr-2" />
                          Выйти
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию и сообщениям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full grid grid-cols-3 rounded-none border-b border-border">
            <TabsTrigger value="chats">
              Чаты {unreadCount > 0 && <Badge className="ml-2 bg-primary text-xs">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="channels">Каналы</TabsTrigger>
            <TabsTrigger value="contacts">Контакты</TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="flex-1 m-0">
            <ScrollArea className="h-full">
              {filteredChats.filter(c => c.type === 'chat' || c.type === 'group').map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors ${
                    selectedChat === chat.id ? 'bg-accent' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {chat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{chat.name}</span>
                          {chat.type === 'group' && (
                            <Icon name="Users" size={14} className="text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                        {chat.unread > 0 && (
                          <Badge className="ml-2 bg-primary">{chat.unread}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="channels" className="flex-1 m-0">
            <ScrollArea className="h-full">
              {filteredChats.filter(c => c.type === 'channel').map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors ${
                    selectedChat === chat.id ? 'bg-accent' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {chat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{chat.name}</span>
                          <Icon name="Radio" size={14} className="text-muted-foreground flex-shrink-0" />
                        </div>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="contacts" className="flex-1 m-0">
            <ScrollArea className="h-full">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 border-b border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className={contact.blocked ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}>
                          {contact.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {!contact.blocked && contact.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                      {!contact.blocked && contact.status === 'away' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{contact.name}</span>
                        {contact.blocked ? (
                          <Badge variant="destructive" className="text-xs">
                            <Icon name="Ban" size={12} className="mr-1" />
                            Заблокирован
                          </Badge>
                        ) : (
                          <span className={`text-xs ${
                            contact.status === 'online' ? 'text-green-500' : 
                            contact.status === 'away' ? 'text-yellow-500' : 
                            'text-muted-foreground'
                          }`}>
                            {contact.status === 'online' ? 'В сети' : 
                             contact.status === 'away' ? 'Отошел' : 
                             'Не в сети'}
                          </span>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Icon name="MoreVertical" size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleBlockUser(contact.id)}>
                          <Icon name={contact.blocked ? "UserCheck" : "Ban"} size={16} className="mr-2" />
                          {contact.blocked ? 'Разблокировать' : 'Заблокировать'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="cursor-pointer" onClick={() => setChatInfoOpen(true)}>
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {currentChat?.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{currentChat?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentChat?.type === 'group' && `${currentChat.members?.length || 0} участников`}
                    {currentChat?.type === 'channel' && 'Канал'}
                    {currentChat?.type === 'chat' && 'В сети'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Input
                    placeholder="Поиск в чате..."
                    value={searchInChat}
                    onChange={(e) => setSearchInChat(e.target.value)}
                    className="w-40 h-9 text-sm"
                  />
                  {searchInChat && (
                    <Badge className="absolute -top-2 -right-2 bg-primary text-xs">
                      {filteredMessages.length}
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="icon">
                  <Icon name="Phone" size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="Video" size={20} />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Icon name="MoreVertical" size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setChatInfoOpen(true)}>
                      <Icon name="Info" size={16} className="mr-2" />
                      Информация
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Icon name="Pin" size={16} className="mr-2" />
                      Закрепить
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Icon name="Archive" size={16} className="mr-2" />
                      Архивировать
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDeleteChat(selectedChat)} className="text-destructive">
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Удалить чат
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-3xl mx-auto">
                {(searchInChat ? filteredMessages : currentChat?.messages || []).map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.senderId === 'current' ? 'justify-end' : ''}`}>
                    {msg.senderId !== 'current' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {currentChat?.avatar}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`flex-1 ${msg.senderId === 'current' ? 'flex flex-col items-end' : ''}`}>
                      <div className={`group relative ${msg.senderId === 'current' ? 'bg-primary text-primary-foreground' : 'bg-card'} p-3 rounded-lg ${msg.senderId === 'current' ? 'rounded-tr-none' : 'rounded-tl-none'} max-w-md`}>
                        {editingMessageId === msg.id ? (
                          <div className="space-y-2">
                            <Textarea
                              defaultValue={msg.text}
                              className="min-h-[60px]"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleEditMessage(msg.id, e.currentTarget.value);
                                }
                              }}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={(e) => {
                                const textarea = e.currentTarget.parentElement?.parentElement?.querySelector('textarea');
                                if (textarea) handleEditMessage(msg.id, textarea.value);
                              }}>
                                Сохранить
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingMessageId(null)}>
                                Отмена
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                            {msg.edited && (
                              <span className="text-xs opacity-70 mt-1 block">изменено</span>
                            )}
                          </>
                        )}
                        {msg.senderId === 'current' && !editingMessageId && (
                          <div className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingMessageId(msg.id)}>
                              <Icon name="Edit" size={14} />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDeleteMessage(msg.id)}>
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 inline-block px-2">
                        {msg.timestamp.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                        {msg.senderId === 'current' && settings.readReceipts && (
                          <Icon name="CheckCheck" size={12} className="inline ml-1 text-primary" />
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2 max-w-4xl mx-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Icon name="Plus" size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Icon name="Image" size={16} className="mr-2" />
                      Фото
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Icon name="File" size={16} className="mr-2" />
                      Файл
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Icon name="MapPin" size={16} className="mr-2" />
                      Локация
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Input
                  placeholder="Введите сообщение..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Icon name="Smile" size={20} />
                </Button>
                <Button size="icon" onClick={handleSendMessage}>
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                <Icon name="MessageSquare" size={40} className="text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Выберите чат</h3>
                <p className="text-muted-foreground">Выберите чат из списка или создайте новый</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать профиль</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {currentUser?.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <Label>Имя пользователя</Label>
              <Input value={currentUser?.username} disabled />
            </div>
            <div className="space-y-2">
              <Label>О себе</Label>
              <Textarea
                placeholder="Расскажите о себе..."
                value={currentUser?.bio}
                onChange={(e) => setCurrentUser(prev => prev ? { ...prev, bio: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Статус</Label>
              <Select
                value={currentUser?.status}
                onValueChange={(v) => setCurrentUser(prev => prev ? { ...prev, status: v as any } : null)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">В сети</SelectItem>
                  <SelectItem value="away">Отошел</SelectItem>
                  <SelectItem value="offline">Не в сети</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setEditProfileOpen(false);
              toast({ title: 'Сохранено', description: 'Профиль обновлен' });
            }}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={blockedUsersOpen} onOpenChange={setBlockedUsersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Заблокированные пользователи</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-2 py-4">
              {contacts.filter(c => c.blocked).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Нет заблокированных пользователей</p>
              ) : (
                contacts.filter(c => c.blocked).map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-destructive/20 text-destructive">
                          {contact.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{contact.name}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleBlockUser(contact.id)}>
                      Разблокировать
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={chatInfoOpen} onOpenChange={setChatInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Информация о чате</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                  {currentChat?.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{currentChat?.name}</h3>
                <p className="text-sm text-muted-foreground">{currentChat?.description || 'Нет описания'}</p>
              </div>
            </div>

            {currentChat?.type === 'group' && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Участники ({currentChat.members?.length || 0})</h4>
                <div className="space-y-2">
                  {currentChat.members?.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {member.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Статистика</h4>
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Сообщений</p>
                  <p className="text-xl font-bold">{currentChat?.messages.length || 0}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Медиа</p>
                  <p className="text-xl font-bold">0</p>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
