import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingSpinner from "../LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_AUDIO_TYPES = ["audio/mpeg", "audio/wav"];
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const releaseSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  artist: z.string().min(1, { message: "Artist name is required" }),
  genre: z.string().min(1, { message: "Genre is required" }),
  releaseDate: z.string().min(1, { message: "Release date is required" }),
  coverArt: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 10MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, and .png files are accepted"
    )
    .optional(),
  audioFile: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 10MB")
    .refine(
      (file) => ACCEPTED_AUDIO_TYPES.includes(file?.type),
      "Only .mp3 and .wav files are accepted"
    ),
});

type ReleaseFormValues = z.infer<typeof releaseSchema>;

const ReleaseForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const { user } = useAuth();

  const form = useForm<ReleaseFormValues>({
    resolver: zodResolver(releaseSchema),
    defaultValues: {
      title: "",
      artist: user?.name || "",
      genre: "",
      releaseDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (values: ReleaseFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit releases",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      let coverArtUrl = null;
      
      if (values.coverArt) {
        const fileExt = values.coverArt.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('releases')
          .upload(filePath, values.coverArt);
          
        if (uploadError) {
          throw new Error(`Error uploading cover art: ${uploadError.message}`);
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('releases')
          .getPublicUrl(filePath);
          
        coverArtUrl = publicUrl;
      }
      
      const { error } = await supabase
        .from('releases')
        .insert({
          title: values.title,
          artist_id: user.id,
          release_date: values.releaseDate,
          platforms: ["Spotify", "Apple Music", "Amazon Music"],
          status: "Pending",
          cover_art_url: coverArtUrl,
        });
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Submission Received",
        description: `Your release "${values.title}" is under review.`,
      });
      
      form.reset();
      setCoverPreview(null);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was a problem submitting your release.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCoverArtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Song Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the title of your song" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="artist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Artist Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter artist name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pop">Pop</SelectItem>
                    <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
                    <SelectItem value="R&B">R&B</SelectItem>
                    <SelectItem value="Rock">Rock</SelectItem>
                    <SelectItem value="Electronic">Electronic</SelectItem>
                    <SelectItem value="Jazz">Jazz</SelectItem>
                    <SelectItem value="Country">Country</SelectItem>
                    <SelectItem value="Classical">Classical</SelectItem>
                    <SelectItem value="Reggae">Reggae</SelectItem>
                    <SelectItem value="Folk">Folk</SelectItem>
                    <SelectItem value="Alternative">Alternative</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="releaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Release Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverArt"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Cover Art</FormLabel>
                <FormControl>
                  <div className="flex flex-col space-y-2">
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => {
                        onChange(e.target.files?.[0]);
                        handleCoverArtChange(e);
                      }}
                      {...field}
                    />
                    {coverPreview && (
                      <div className="mt-2">
                        <img
                          src={coverPreview}
                          alt="Cover art preview"
                          className="h-20 w-20 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="audioFile"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Audio File (MP3/WAV)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".mp3,.wav"
                    onChange={(e) => onChange(e.target.files?.[0])}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoadingSpinner size={20} className="mr-2" />
              Submitting...
            </>
          ) : (
            "Submit Release"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ReleaseForm;
