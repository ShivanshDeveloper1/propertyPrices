"use client";
import { useState, useEffect } from "react";
import { getAllProperties, deleteProperty } from "@/actions/(admin)/getPropertyAndDelete/properties";
import { Trash2, ExternalLink } from "lucide-react"; // Optional icons

const AdminPropertyManager = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data on load
  const loadData = async () => {
    setLoading(true);
    const data = await getAllProperties();
    setProperties(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. Handle Delete
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const result = await deleteProperty(id);
    if (result.success) {
      // Update local state to remove the item immediately
      setProperties(properties.filter((p: any) => p._id !== id));
      alert("Deleted successfully");
    } else {
      alert("Error: " + result.message);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading properties...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Property Management</h2>
      
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Title</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Slug</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties.map((item: any) => (
              <tr key={item._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {item.slug}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    className="inline-flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {properties.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No properties found in database.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPropertyManager;