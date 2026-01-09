import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface User {
  username: string;
  password: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  type: 'chat' | 'group' | 'channel';
}

interface Contact {
  id: string;
  name: string;
  status: 'online' | 'offline';
  avatar: string;
  blocked?: boolean;
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

  const mockChats: Chat[] = [
    { id: '1', name: 'Александр Петров', lastMessage: 'Привет! Как дела?', time: '14:32', unread: 2, avatar: 'АП', type: 'chat' },
    { id: '2', name: 'Мария Иванова', lastMessage: 'Отправила файл', time: '13:15', unread: 0, avatar: 'МИ', type: 'chat' },
    { id: '3', name: 'Разработчики', lastMessage: 'Дмитрий: Завтра созвон в 10:00', time: '12:45', unread: 5, avatar: 'Р', type: 'group' },
    { id: '4', name: 'Новости IT', lastMessage: 'Выпуск новой версии React', time: 'вчера', unread: 0, avatar: 'IT', type: 'channel' },
    { id: '5', name: 'Проект Alpha', lastMessage: 'Обновлена документация', time: 'вчера', unread: 1, avatar: 'PA', type: 'group' },
  ];

  const mockContacts: Contact[] = [
    { id: '1', name: 'Александр Петров', status: 'online', avatar: 'АП' },
    { id: '2', name: 'Мария Иванова', status: 'offline', avatar: 'МИ' },
    { id: '3', name: 'Дмитрий Сидоров', status: 'online', avatar: 'ДС' },
    { id: '4', name: 'Елена Козлова', status: 'offline', avatar: 'ЕК' },
    { id: '5', name: 'Игорь Смирнов', status: 'online', avatar: 'ИС', blocked: true },
  ];

  const handleAuth = () => {
    if (!username || !password) return;
    setCurrentUser({ username, password });
    setIsLoggedIn(true);
  };

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Icon name="Settings" size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Профиль и настройки</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {currentUser?.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{currentUser?.username}</p>
                      <p className="text-sm text-muted-foreground">В сети</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Shield" size={18} className="mr-2" />
                      Заблокированные пользователи
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Bell" size={18} className="mr-2" />
                      Уведомления
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Lock" size={18} className="mr-2" />
                      Приватность
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      onClick={() => setIsLoggedIn(false)}
                    >
                      <Icon name="LogOut" size={18} className="mr-2" />
                      Выйти
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full grid grid-cols-3 rounded-none border-b border-border">
            <TabsTrigger value="chats">Чаты</TabsTrigger>
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
                          <span className={`text-xs ${contact.status === 'online' ? 'text-green-500' : 'text-muted-foreground'}`}>
                            {contact.status === 'online' ? 'В сети' : 'Не в сети'}
                          </span>
                        )}
                      </div>
                    </div>
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
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {mockChats.find(c => c.id === selectedChat)?.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{mockChats.find(c => c.id === selectedChat)?.name}</p>
                  <p className="text-xs text-muted-foreground">В сети</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Icon name="Phone" size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="Video" size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-3xl mx-auto">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {mockChats.find(c => c.id === selectedChat)?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-card p-3 rounded-lg rounded-tl-none max-w-md">
                      <p className="text-sm">Привет! Как дела?</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2 mt-1 inline-block">14:30</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="flex-1 flex flex-col items-end">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none max-w-md">
                      <p className="text-sm">Отлично! Работаю над новым проектом</p>
                    </div>
                    <span className="text-xs text-muted-foreground mr-2 mt-1 inline-block">14:32</span>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2 max-w-4xl mx-auto">
                <Button variant="ghost" size="icon">
                  <Icon name="Paperclip" size={20} />
                </Button>
                <Input
                  placeholder="Введите сообщение..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon">
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
                <p className="text-muted-foreground">Выберите чат из списка слева, чтобы начать общение</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
