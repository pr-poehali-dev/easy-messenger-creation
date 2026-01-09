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
  avatarColor?: string;
  avatarEmoji?: string;
  bio?: string;
  tag?: string;
  status: 'online' | 'offline' | 'away';
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  edited?: boolean;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  type: 'chat' | 'channel';
  messages: Message[];
  description?: string;
}

const REGISTERED_USERS = [
  { name: 'Александр', tag: 'alex2024' },
  { name: 'Мария', tag: 'maria_m' },
  { name: 'Дмитрий', tag: 'dmitry_dev' },
  { name: 'Елена', tag: 'elena_k' },
  { name: 'Игорь', tag: 'igor_s' },
  { name: 'Ольга', tag: 'olga_designer' },
  { name: 'Сергей', tag: 'sergey_pro' }
];
const AVAILABLE_CHANNELS = ['Новости', 'Технологии', 'Спорт', 'Музыка', 'Кино'];

const AVATAR_COLORS = [
  '#9b87f5', '#F97316', '#0EA5E9', '#10B981', '#F59E0B',
  '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1'
];

const AVATAR_EMOJIS = [
  '😀', '😎', '🚀', '⚡', '🔥', '💎', '🎯', '🎨', '🎮', '🎵',
  '⭐', '🌟', '💫', '✨', '🌈', '🦄', '🐱', '🐶', '🦊', '🐼'
];

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
  const [chats, setChats] = useState<Chat[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  const [settings, setSettings] = useState({
    notifications: true,
    readReceipts: true,
    lastSeen: true,
    profilePhoto: true,
    autoDownload: false
  });

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editAvatarOpen, setEditAvatarOpen] = useState(false);
  const [createChatOpen, setCreateChatOpen] = useState(false);
  const [blockedUsersOpen, setBlockedUsersOpen] = useState(false);
  const [chatInfoOpen, setChatInfoOpen] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchInChat, setSearchInChat] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedChats = localStorage.getItem('chats');
    const savedBlockedUsers = localStorage.getItem('blockedUsers');
    const savedSettings = localStorage.getItem('settings');

    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      parsedChats.forEach((chat: Chat) => {
        chat.messages = chat.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
      });
      setChats(parsedChats);
    }
    if (savedBlockedUsers) setBlockedUsers(JSON.parse(savedBlockedUsers));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
  }, [blockedUsers]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const handleAuth = () => {
    if (!username || !password) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }
    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const randomEmoji = AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)];
    const newUser = { 
      username, 
      password, 
      status: 'online', 
      bio: 'Новый пользователь',
      avatarColor: randomColor,
      avatarEmoji: randomEmoji,
      tag: ''
    };
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    toast({ title: 'Успешно', description: `Добро пожаловать, ${username}!` });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setChats([]);
    setBlockedUsers([]);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('chats');
    localStorage.removeItem('blockedUsers');
    toast({ title: 'Выход', description: 'Вы вышли из системы' });
  };

  const handleCreateChat = () => {
    if (!searchUsername.trim()) {
      toast({ title: 'Ошибка', description: 'Введите имя пользователя', variant: 'destructive' });
      return;
    }

    if (blockedUsers.includes(searchUsername)) {
      toast({ title: 'Ошибка', description: 'Этот пользователь заблокирован', variant: 'destructive' });
      return;
    }

    const foundUser = REGISTERED_USERS.find(u => u.name === searchUsername || u.tag === searchUsername);
    if (!foundUser) {
      toast({ title: 'Пользователь не найден', description: `Пользователь "${searchUsername}" не существует`, variant: 'destructive' });
      return;
    }
    const actualName = foundUser.name;

    const existingChat = chats.find(c => c.name === actualName && c.type === 'chat');
    if (existingChat) {
      setSelectedChat(existingChat.id);
      setCreateChatOpen(false);
      toast({ title: 'Чат найден', description: 'Переход к существующему чату' });
      return;
    }

    const newChat: Chat = {
      id: `${Date.now()}`,
      name: actualName,
      lastMessage: 'Чат создан',
      time: 'сейчас',
      unread: 0,
      avatar: actualName.substring(0, 2).toUpperCase(),
      type: 'chat',
      messages: []
    };

    setChats(prev => [newChat, ...prev]);
    setSearchUsername('');
    setCreateChatOpen(false);
    setSelectedChat(newChat.id);
    toast({ title: 'Создано', description: `Чат с ${actualName} создан` });
  };

  const handleJoinChannel = () => {
    if (!searchUsername.trim()) {
      toast({ title: 'Ошибка', description: 'Введите название канала', variant: 'destructive' });
      return;
    }

    if (!AVAILABLE_CHANNELS.includes(searchUsername)) {
      toast({ title: 'Канал не найден', description: `Канал "${searchUsername}" не существует`, variant: 'destructive' });
      return;
    }

    const existingChannel = chats.find(c => c.name === searchUsername && c.type === 'channel');
    if (existingChannel) {
      setSelectedChat(existingChannel.id);
      setCreateChatOpen(false);
      toast({ title: 'Канал найден', description: 'Вы уже подписаны на этот канал' });
      return;
    }

    const newChannel: Chat = {
      id: `${Date.now()}`,
      name: searchUsername,
      lastMessage: 'Добро пожаловать в канал',
      time: 'сейчас',
      unread: 0,
      avatar: searchUsername.substring(0, 2).toUpperCase(),
      type: 'channel',
      messages: [{
        id: 'm1',
        senderId: 'admin',
        text: `Добро пожаловать в канал "${searchUsername}"!`,
        timestamp: new Date()
      }],
      description: `Канал ${searchUsername}`
    };

    setChats(prev => [newChannel, ...prev]);
    setSearchUsername('');
    setCreateChatOpen(false);
    setSelectedChat(newChannel.id);
    toast({ title: 'Подписка оформлена', description: `Вы подписались на канал ${searchUsername}` });
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

  const handleBlockUser = (userName: string) => {
    if (blockedUsers.includes(userName)) {
      setBlockedUsers(prev => prev.filter(u => u !== userName));
      toast({ title: 'Разблокирован', description: `${userName} разблокирован` });
    } else {
      setBlockedUsers(prev => [...prev, userName]);
      setChats(prev => prev.filter(c => c.name !== userName));
      if (currentChat?.name === userName) setSelectedChat(null);
      toast({ title: 'Заблокирован', description: `${userName} заблокирован` });
    }
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
                    <DialogTitle>
                      {activeTab === 'chats' ? 'Создать чат' : 'Найти канал'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>
                        {activeTab === 'chats' ? 'Имя пользователя' : 'Название канала'}
                      </Label>
                      <Input
                        placeholder={activeTab === 'chats' ? 'Введите имя пользователя' : 'Введите название канала'}
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            activeTab === 'chats' ? handleCreateChat() : handleJoinChannel();
                          }
                        }}
                      />
                    </div>
                    {activeTab === 'chats' ? (
                      <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">Поиск по имени или тегу:</p>
                        <div className="space-y-1">
                          {REGISTERED_USERS.map((user, idx) => (
                            <p key={idx} className="text-sm">
                              {user.name} <span className="text-muted-foreground">@{user.tag}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">Доступные каналы:</p>
                        <p className="text-sm">{AVAILABLE_CHANNELS.join(', ')}</p>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button onClick={activeTab === 'chats' ? handleCreateChat : handleJoinChannel}>
                      {activeTab === 'chats' ? 'Создать' : 'Подписаться'}
                    </Button>
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
                          <Avatar 
                            className="h-16 w-16 cursor-pointer relative" 
                            onClick={() => setEditAvatarOpen(true)}
                            style={{ backgroundColor: currentUser?.avatarColor || '#9b87f5' }}
                          >
                            <AvatarFallback 
                              className="text-3xl border-2 border-background"
                              style={{ backgroundColor: currentUser?.avatarColor || '#9b87f5' }}
                            >
                              {currentUser?.avatarEmoji || currentUser?.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
                              <Icon name="Camera" size={12} className="text-muted-foreground" />
                            </div>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold">{currentUser?.username}</p>
                            {currentUser?.tag ? (
                              <p className="text-sm text-primary">@{currentUser.tag}</p>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">Тег не установлен</p>
                            )}
                            <p className="text-xs text-muted-foreground truncate">{currentUser?.bio || 'Нет описания'}</p>
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
                            <p className="text-xs text-muted-foreground">Заблокировано</p>
                            <p className="text-2xl font-bold">{blockedUsers.length}</p>
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
                          Заблокированные ({blockedUsers.length})
                        </Button>
                        <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
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
              placeholder="Поиск по чатам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full grid grid-cols-2 rounded-none border-b border-border">
            <TabsTrigger value="chats">
              Чаты {unreadCount > 0 && <Badge className="ml-2 bg-primary text-xs">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="channels">Каналы</TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="flex-1 m-0">
            <ScrollArea className="h-full">
              {filteredChats.filter(c => c.type === 'chat').length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Icon name="MessageSquare" size={48} className="text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Нет чатов</h3>
                  <p className="text-sm text-muted-foreground mb-4">Нажмите "+" чтобы создать чат</p>
                </div>
              ) : (
                filteredChats.filter(c => c.type === 'chat').map((chat) => (
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
                          <span className="font-medium truncate">{chat.name}</span>
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
                ))
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="channels" className="flex-1 m-0">
            <ScrollArea className="h-full">
              {filteredChats.filter(c => c.type === 'channel').length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Icon name="Radio" size={48} className="text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Нет каналов</h3>
                  <p className="text-sm text-muted-foreground mb-4">Нажмите "+" чтобы подписаться на канал</p>
                </div>
              ) : (
                filteredChats.filter(c => c.type === 'channel').map((chat) => (
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
                ))
              )}
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
                    {currentChat?.type === 'channel' ? 'Канал' : 'В сети'}
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
                    {currentChat?.type === 'chat' && (
                      <DropdownMenuItem onClick={() => handleBlockUser(currentChat.name)}>
                        <Icon name="Ban" size={16} className="mr-2" />
                        Заблокировать
                      </DropdownMenuItem>
                    )}
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
              <Avatar 
                className="h-24 w-24 cursor-pointer" 
                onClick={() => setEditAvatarOpen(true)}
                style={{ backgroundColor: currentUser?.avatarColor || '#9b87f5' }}
              >
                <AvatarFallback 
                  className="text-4xl"
                  style={{ backgroundColor: currentUser?.avatarColor || '#9b87f5' }}
                >
                  {currentUser?.avatarEmoji || currentUser?.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <Label>Имя пользователя</Label>
              <Input value={currentUser?.username} disabled />
            </div>
            <div className="space-y-2">
              <Label>Тег <span className="text-xs text-muted-foreground">(для поиска)</span></Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <Input
                  placeholder="ваш_тег"
                  value={currentUser?.tag}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
                    setCurrentUser(prev => prev ? { ...prev, tag: value } : null);
                  }}
                  className="pl-7"
                  maxLength={20}
                />
              </div>
              <p className="text-xs text-muted-foreground">Друзья смогут найти вас по этому тегу</p>
            </div>
            <div className="space-y-2">
              <Label>О себе</Label>
              <Textarea
                placeholder="Расскажите о себе..."
                value={currentUser?.bio}
                onChange={(e) => setCurrentUser(prev => prev ? { ...prev, bio: e.target.value } : null)}
                maxLength={150}
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
              if (currentUser?.tag && currentUser.tag.length < 3) {
                toast({ title: 'Ошибка', description: 'Тег должен содержать минимум 3 символа', variant: 'destructive' });
                return;
              }
              setEditProfileOpen(false);
              toast({ title: 'Сохранено', description: 'Профиль обновлен' });
            }}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editAvatarOpen} onOpenChange={setEditAvatarOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить аватар</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex justify-center">
              <Avatar 
                className="h-32 w-32"
                style={{ backgroundColor: currentUser?.avatarColor || '#9b87f5' }}
              >
                <AvatarFallback 
                  className="text-5xl"
                  style={{ backgroundColor: currentUser?.avatarColor || '#9b87f5' }}
                >
                  {currentUser?.avatarEmoji || currentUser?.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-3">
              <Label>Выберите эмодзи</Label>
              <div className="grid grid-cols-10 gap-2">
                {AVATAR_EMOJIS.map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentUser(prev => prev ? { ...prev, avatarEmoji: emoji } : null)}
                    className={`text-2xl p-2 rounded-lg hover:bg-accent transition-colors ${
                      currentUser?.avatarEmoji === emoji ? 'bg-accent ring-2 ring-primary' : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Выберите цвет фона</Label>
              <div className="grid grid-cols-5 gap-3">
                {AVATAR_COLORS.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentUser(prev => prev ? { ...prev, avatarColor: color } : null)}
                    className={`h-12 rounded-lg transition-all ${
                      currentUser?.avatarColor === color ? 'ring-4 ring-primary scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setEditAvatarOpen(false);
              toast({ title: 'Сохранено', description: 'Аватар обновлен' });
            }}>
              Готово
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
              {blockedUsers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Нет заблокированных пользователей</p>
              ) : (
                blockedUsers.map((userName) => (
                  <div key={userName} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-destructive/20 text-destructive">
                          {userName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{userName}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleBlockUser(userName)}>
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
                <p className="text-sm text-muted-foreground">{currentChat?.description || currentChat?.type === 'chat' ? 'Личный чат' : 'Канал'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Статистика</h4>
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Сообщений</p>
                  <p className="text-xl font-bold">{currentChat?.messages.length || 0}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-muted-foreground">Тип</p>
                  <p className="text-xl font-bold">{currentChat?.type === 'chat' ? '💬' : '📢'}</p>
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