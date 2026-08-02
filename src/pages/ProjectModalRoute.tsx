import { useNavigate, useParams } from "react-router-dom";
import { ProjectModal } from "../components/ProjectModal/ProjectModal";
import { findProject } from "../data/projects";

export function ProjectModalRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = id ? findProject(id) : undefined;

  return (
    <ProjectModal
      project={project ?? null}
      onClose={() => navigate(-1)}
    />
  );
}
