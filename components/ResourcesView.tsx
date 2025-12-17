import React from 'react';
import { Lesson, Resource } from '../types';
import { Book, Video, Globe, FileText, ExternalLink, Search } from 'lucide-react';

interface ResourcesViewProps {
  lessons: Lesson[];
}

const ResourcesView: React.FC<ResourcesViewProps> = ({ lessons }) => {
  // Aggregate resources
  const allResources: { resource: Resource; subject: string; date: string }[] = [];
  lessons.forEach(l => {
    l.resources.forEach(r => {
      allResources.push({ resource: r, subject: l.subject, date: l.date });
    });
  });

  const getIcon = (type: string) => {
    switch(type) {
      case 'video': return <Video className="w-5 h-5 text-red-500" />;
      case 'website': return <Globe className="w-5 h-5 text-blue-500" />;
      case 'worksheet': return <FileText className="w-5 h-5 text-orange-500" />;
      default: return <Book className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
           <h1 className="text-3xl font-bold text-stone-900">Learning Resources</h1>
           <p className="text-stone-500 mt-1 font-medium">Books, videos, and materials from your lessons.</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-stone-400" />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-72 bg-white shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allResources.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border-2 border-dashed border-stone-200">
             <Book className="w-12 h-12 text-stone-200 mx-auto mb-4" />
             <p className="text-stone-500 font-medium">No resources added to lessons yet.</p>
          </div>
        ) : (
          allResources.map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-stone-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                  {getIcon(item.resource.type)}
                </div>
                <a href={item.resource.url || '#'} className="text-stone-300 hover:text-indigo-600 p-1 hover:bg-stone-50 rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              <h3 className="font-bold text-stone-800 text-lg line-clamp-2 leading-snug mb-4 flex-1">{item.resource.title}</h3>
              
              <div className="pt-4 border-t border-stone-50 flex items-center justify-between text-xs font-medium">
                <span className="bg-stone-100 text-stone-600 px-2.5 py-1 rounded-md">{item.subject}</span>
                <span className="capitalize text-stone-400 uppercase tracking-wide">{item.resource.type}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResourcesView;