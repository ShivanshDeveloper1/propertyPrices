"use client";
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Agent {
  name: string;
  image?: string;
  bio?: string;
  city?: string;
}

interface AgentCardProps {
  agent: Agent;
}

const AgentCard = ({ agent }: AgentCardProps) => {

  const router = useRouter()
  return (
    <Link  href={`/dealer/${agent.slug}`} className="group relative overflow-hidden rounded-[2.5rem] bg-gray-200 aspect-[4/5] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer" >
      
      <div className="absolute inset-0">
        <Image
          src={agent.image || "/default-avatar.jpg"}
          alt={agent.name || "Agent"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
      </div>

      <div className="absolute bottom-0 left-0 p-10 w-full text-white ">
        <h3 className="text-3xl font-semibold mb-1 tracking-tight">
          {agent.name}
        </h3>

        <p className="text-gray-300 text-lg font-light">
          {agent.bio || "Senior Consultant"}
        </p>

        <div className="mt-4 overflow-hidden h-0 group-hover:h-8 transition-all duration-300">
          <span className="text-blue-400 font-medium">
            {agent.city || "Saharanpur"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default AgentCard;