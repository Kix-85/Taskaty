import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Grid3X3, List as ListIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { ProjectEditModal } from "@/components/ProjectEditModal";
import { projectService, Project } from "@/services/projectService";
import { toast } from "sonner";
// import Cookies from "node_modules/@types/js-cookie";
import Cookies from 'js-cookie';
import api from "@/lib/axios";

// Sample project data


const Projects = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAllProjects();
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error('Failed to fetch projects');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on search query
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Just Started':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'In Progress':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'Almost Done':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const handleProjectClick = (project: Project) => {
    if (!project._id) {
      toast.error('Invalid project ID');
      return;
    }
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <header className="page-header">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage your projects and team collaboration</p>
          </div>

          <Button
            className="w-full md:w-auto"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} className="mr-2" />
            New Project
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter size={16} />
            </Button>

            <div className="flex rounded-md border">
              <Button
                variant={viewType === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewType('grid')}
                className="rounded-l-md rounded-r-none"
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant={viewType === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewType('list')}
                className="rounded-l-none rounded-r-md"
              >
                <ListIcon size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="content-area">
        {viewType === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card 
                key={project._id} 
                className="transition-all duration-200 hover:shadow-md cursor-pointer"
                onClick={() => handleProjectClick(project)}
              >
                <CardHeader className="pb-2">
                  <CardTitle>{project.name}</CardTitle>
                  <div className="flex items-center justify-between">
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress || 0}%</span>
                    </div>
                    <Progress value={project.progress || 0} className="h-2" />
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date'}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredProjects.map((project) => (
              <Card 
                key={project._id} 
                className="transition-all duration-200 hover:shadow-md cursor-pointer"
                onClick={() => handleProjectClick(project)}
              >
                <div className="flex flex-col sm:flex-row p-4 gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{project.description}</p>
                  </div>

                  <div className="sm:w-60 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress || 0}%</span>
                    </div>
                    <Progress value={project.progress || 0} className="h-2" />
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm text-muted-foreground">
                        Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date'}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={fetchProjects}
      />

      {selectedProject && (
        <ProjectEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
          onProjectUpdated={fetchProjects}
        />
      )}
    </div>
  );
};

export default Projects;
