import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Grid3X3, List as ListIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { toast } from "sonner";
import api from "@/lib/axios";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  dueDate: string;
  progress: number;
  teamMembers: TeamMember[];
  leader: TeamMember;
}

const Projects = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/project/me');
        setProjects(response.data);
      } catch (error) {
        // Error is already handled by axios interceptor
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  // Filter projects based on search query
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'just started':
        return 'bg-blue-500';
      case 'in progress':
        return 'bg-yellow-500';
      case 'on hold':
        return 'bg-orange-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewType === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewType('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === 'list' ? 'default' : 'outline'}
            onClick={() => setViewType('list')}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by creating a new project.
          </p>
        </div>
      ) : (
        <div className={viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProjects.map((project) => (
            <Card key={project._id} className={viewType === 'list' ? 'flex' : ''}>
              <CardHeader className={viewType === 'list' ? 'flex-1' : ''}>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription className="mt-1">{project.description}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className={viewType === 'list' ? 'flex-1' : ''}>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.progress || 0}%</span>
                    </div>
                    <Progress value={project.progress || 0} />
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Due Date: </span>
                    {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Not set'}
                  </div>
                </div>
              </CardContent>
              <CardFooter className={viewType === 'list' ? 'flex-1' : ''}>
                <div className="flex items-center space-x-2">
                  {project.teamMembers?.map((member) => (
                    <div
                      key={member._id}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium"
                      title={member.name}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Projects;
