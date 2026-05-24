"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { useAdminToast } from "@/app/admin/layout";
import { tagsService } from "@/services/tags";
import type { TagWithCount } from "@/types";

export default function AdminTagsPage() {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const { addToast } = useAdminToast();

  const fetchTags = async () => {
    try {
      const data = await tagsService.getAll();
      setTags(data);
    } catch {
      addToast("Failed to load tags", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setModalOpen(true);
  };

  const openEdit = (tag: TagWithCount) => {
    setEditingId(tag.id);
    setName(tag.name);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      if (editingId) {
        await tagsService.update(editingId, { name: name.trim() });
        addToast("Tag updated", "success");
      } else {
        await tagsService.create({ name: name.trim() });
        addToast("Tag created", "success");
      }
      setModalOpen(false);
      fetchTags();
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Operation failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This tag will be removed from all posts.")) return;
    try {
      await tagsService.delete(id);
      addToast("Tag deleted", "success");
      fetchTags();
    } catch {
      addToast("Failed to delete tag", "error");
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
          <h1 className="text-2xl font-bold text-white">Tags</h1>
          <p className="text-gray-400 text-sm mt-1">Manage post tags</p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-600/25 transition-all text-sm"
        >
          + New Tag
        </button>
      </div>

      {tags.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.02] rounded-2xl border border-white/10">
          <p className="text-gray-500">No tags yet</p>
          <button onClick={openCreate} className="mt-4 text-sm text-violet-400 hover:text-violet-300">
            Create your first tag
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
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-medium">{tag.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">{tag.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{tag.post_count}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(tag)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-400 hover:text-white text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id)}
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Tag" : "New Tag"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tag name..."
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
