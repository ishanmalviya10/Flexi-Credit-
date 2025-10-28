import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { insertLabNoteSchema, type InsertLabNote, type LabNote } from "@shared/schema";
import { FileText, Plus, Calendar, Search, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LabNotebook() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["/api/lab-notes"],
  });

  const notesList = (notes as LabNote[]) || [];

  const form = useForm<InsertLabNote>({
    resolver: zodResolver(insertLabNoteSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertLabNote) => {
      const res = await apiRequest("POST", "/api/lab-notes", data);
      return await res.json() as LabNote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lab-notes"] });
      setOpen(false);
      form.reset();
      toast({
        title: "Note created",
        description: "Lab note has been saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create note",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredNotes = notesList.filter((note: LabNote) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.tags && note.tags.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-600/20">
              <FileText className="w-6 h-6 text-teal-500" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="gradient-text">Lab Notebook</span>
            </h1>
          </div>
          <p className="text-muted-foreground">
            Document experiments, observations, and research findings
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-purple-teal text-white shadow-lg shadow-purple-500/30" size="lg" data-testid="button-new-note">
              <Plus className="w-5 h-5 mr-2" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl glass-card">
            <DialogHeader>
              <DialogTitle className="text-xl gradient-text">Create Lab Note</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Experiment title or observation"
                          className="glass"
                          {...field}
                          data-testid="input-note-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed notes, procedures, observations..."
                          rows={8}
                          className="glass"
                          {...field}
                          data-testid="input-note-content"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., synthesis, spectroscopy, titration"
                          className="glass"
                          {...field}
                          data-testid="input-note-tags"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="glass" data-testid="button-cancel-note">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending} className="gradient-purple-teal text-white" data-testid="button-save-note">
                    {createMutation.isPending ? "Saving..." : "Save Note"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search notes by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 glass text-base"
              data-testid="input-search-notes"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Loading notes...</div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <Card className="glass-card py-12">
          <CardContent className="text-center space-y-4">
            <div className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-teal-500/10 to-teal-600/10">
              <BookOpen className="w-16 h-16 text-muted-foreground/30" />
            </div>
            <h3 className="font-semibold text-lg">
              {searchQuery ? "No notes found" : "No lab notes yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Create your first lab note to start documenting your research"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredNotes.map((note: LabNote) => (
            <Card key={note.id} className="glass-card hover-elevate hover:scale-[1.02] transition-all duration-300 group" data-testid={`card-note-${note.id}`}>
              <CardHeader>
                <CardTitle className="line-clamp-2 group-hover:gradient-text transition-all">{note.title}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                  {note.content}
                </p>
                {note.tags && (
                  <div className="flex flex-wrap gap-2">
                    {note.tags.split(',').map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-full glass font-medium"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
