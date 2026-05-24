"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { useAdminToast } from "@/app/admin/layout";
import { categoriesService } from "@/services/categories";
import type { CategoryWithCount } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const { addToast } = useAdminToast();

  const fetchCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch {
      addToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setModalOpen(true);
  };

  const openEdit = (cat: CategoryWithCount) => {
    setEditingId(cat.id);
    setName(cat.name);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      if (editingId) {
        await categoriesService.update(editingId, { name: name.trim() });
        addToast("Category updated", "success");
      } else {
        await categoriesService.create({ name: name.trim() });
        addToast("Category created", "success");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Operation failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? Posts in this category will become uncategorized.")) return;
    try {
      await categoriesService.delete(id);
      addToast("Category deleted", "success");
      fetchCategories();
    } catch {
      addToast("Failed to delete category", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSkeleton count={5} type="row" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 text-sm mt-1">Manage post categories</p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-600/25 transition-all text-sm"
        >
          + New Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.02] rounded-2xl border border-white/10">
          <p className="text-gray-500">No categories yet</p>
          <button onClick={openCreate} className="mt-4 text-sm text-violet-400 hover:text-violet-300">
            Create your first category
          </button>
        </div>
      ) : (
        <div className="bg-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Slug</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Posts</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-medium">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">{cat.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{cat.post_count}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-400 hover:text-white text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Category" : "New Category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
