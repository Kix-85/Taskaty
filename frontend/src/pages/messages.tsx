/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockTasks, mockUser } from "@/lib/mockData";

interface Comment {
  id: string;
  user: any;
  text: string;
  createdAt: string;
}

interface Message {
  id: string;
  type: 'comment' | 'notification';
  content: string;
  task?: any;
  user?: any;
  createdAt: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Combine task comments and create notifications
    const allMessages: Message[] = [];
    
    mockTasks.forEach(task => {
      // Add task comments
      if (task.comments) {
        task.comments.forEach((comment: Comment) => {
          allMessages.push({
            id: comment.id,
            type: 'comment',
            content: comment.text,
          task: task,
          user: comment.user,
          createdAt: comment.createdAt
        });
      });

      // Add task notifications
      if (task.status === 'Done') {
        allMessages.push({
          id: `notification-${task.id}`,
          type: 'notification',
          content: `Task "${task.title}" has been completed`,
          task: task,
          createdAt: task.dueDate
        });
      }
  }});

    // Sort by date
    allMessages.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setMessages(allMessages);
  }, []);

  const filteredMessages = messages.filter(message => 
    activeTab === 'all' || message.type === activeTab
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="comment">Comments</TabsTrigger>
          <TabsTrigger value="notification">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <Card key={message.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {message.type === 'comment' ? 'Comment' : 'Notification'}
                      </CardTitle>
                      {message.task && (
                        <p className="text-sm text-gray-500">
                          Task: {message.task.title}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{message.content}</p>
                  {message.type === 'comment' && message.user && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        {message.user.name.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-500">{message.user.name}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
