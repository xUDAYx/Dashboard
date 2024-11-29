import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Github, Linkedin, FolderGit2 } from "lucide-react";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center">
        <h1 className="text-4xl font-bold mb-4">VRV Security's Assignment</h1>
        <div className="max-w-2xl">
          <p className="text-xl mb-6">
            👋 Hello! I'm Uday Jawheri, a Full Stack Developer.{" "}
            <>
              <br />
            </>{" "}
            I'm thrilled to begin this exciting internship opportunity. I'm
            looking forward to learning, contributing, and growing alongside the
            team.
          </p>
          <p className="text-lg mb-8">
            Check out my portfolio of solo projects and work samples below. I've
            crafted various applications that showcase my skills and creativity
            in web development.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button asChild variant="outline">
              <a
                href="https://github.com/xUDAYx"
                className="flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
            </Button>
            <Button asChild variant="outline">
              <a
                href="https://www.linkedin.com/in/uday-jawheri/"
                className="flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </Button>
            <Button asChild variant="outline">
              <a
                href="https://portfolio-six-neon-97.vercel.app"
                className="flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FolderGit2 className="h-4 w-4" /> Projects
              </a>
            </Button>
          </div>
          <Button asChild>
            <a href="/dashboard">View Dashboard →</a>
          </Button>
        </div>
      </main>
      <footer className="row-start-3 text-center text-sm">
        <p>Ready to make a difference and create amazing things!</p>
      </footer>
    </div>
  );
}
