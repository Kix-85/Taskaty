
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Grid3X3, List as ListIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Sample project data
const projects = [
  {
    id: "p1",
    title: "Website Redesign",
    description: "Complete overhaul of the company website with modern UI/UX",
    progress: 65,
    members: [
      { name: "Alex Johnson", initial: "A" },
      { name: "Maria Garcia", initial: "M" },
      { name: "David Lee", initial: "D" }
    ],
    status: "In Progress",
    dueDate: "Jun 15, 2025"
  },
  {
    id: "p2",
    title: "Mobile Application",
    description: "Develop a cross-platform mobile app for task management",
    progress: 30,
    members: [
      { name: "Emily Chen", initial: "E" },
      { name: "James Wilson", initial: "J" }
    ],
    status: "In Progress",
    dueDate: "Jul 20, 2025"
  },
  {
    id: "p3",
    title: "API Integration",
    description: "Connect our services with third-party APIs and ensure data flow",
    progress: 80,
    members: [
      { name: "Sarah Brown", initial: "S" },
      { name: "Alex Johnson", initial: "A" }
    ],
    status: "Almost Done",
    dueDate: "May 30, 2025"
  },
  {
    id: "p4",
    title: "Database Migration",
    description: "Migrate from legacy database to new cloud-based solution",
    progress: 10,
    members: [
      { name: "David Lee", initial: "D" },
      { name: "James Wilson", initial: "J" },
      { name: "Emily Chen", initial: "E" }
    ],
    status: "Just Started",
    dueDate: "Aug 5, 2025"
  },
  {
    id: "p5",
    title: "Analytics Dashboard",
    description: "Build interactive analytics dashboard with real-time data visualization",
    progress: 45,
    members: [
      { name: "Maria Garcia", initial: "M" },
      { name: "Sarah Brown", initial: "S" }
    ],
    status: "In Progress",
    dueDate: "Jul 10, 2025"
  },
  {
    id: "p6",
    title: "Security Audit",
    description: "Complete a comprehensive security audit and implement recommendations",
    progress: 90,
    members: [
      { name: "James Wilson", initial: "J" },
      { name: "Alex Johnson", initial: "A" }
    ],
    status: "Almost Done",
    dueDate: "May 22, 2025"
  }
];

const Projects = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch(status) {
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

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <header className="page-header">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage your projects and team collaboration</p>
          </div>
          
          <Button className="w-full md:w-auto">
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
              <Card key={project.id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle>{project.title}</CardTitle>
                  <div className="flex items-center justify-between">
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <div className="flex -space-x-2">
                    {project.members.map((member, idx) => (
                      <div 
                        key={`${project.id}-member-${idx}`}
                        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium border-2 border-background"
                      >
                        {member.initial}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">Due: {project.dueDate}</div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="transition-all duration-200 hover:shadow-md">
                <div className="flex flex-col sm:flex-row p-4 gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{project.description}</p>
                  </div>
                  
                  <div className="sm:w-60 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((member, idx) => (
                          <div 
                            key={`${project.id}-member-${idx}`}
                            className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium border-2 border-background"
                          >
                            {member.initial}
                          </div>
                        ))}
                        {project.members.length > 3 && (
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium border-2 border-background">
                            +{project.members.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">Due: {project.dueDate}</div>
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
    </div>
  );
};

export default Projects;
