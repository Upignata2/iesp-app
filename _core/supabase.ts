import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ugybcgubtvrjyodcegei.supabase.co';
const supabaseAnonKey = 'sb_publishable_nShPs5nsxdNzxQ4PnkxDfg_18aZH9s1';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVneWJjZ3VidHZyanlvZGNlZ2VpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTEzMzQ0NSwiZXhwIjoyMDgwNzA5NDQ1fQ.Cw5IdJRGlp8nCEYFsQinOL3HKibJVqhrv_WGbIzgcVk';

// Cliente público para leitura
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente com service key para uploads (contorna RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The bucket name (default: 'gallery')
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(file: File, bucket: string = 'gallery'): Promise<string> {
  try {
    // Generate a unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}-${randomStr}-${file.name}`;

    // Upload file to Supabase Storage using admin client (contorna RLS)
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Delete a file from Supabase Storage
 * @param publicUrl - The public URL of the file to delete
 * @param bucket - The bucket name (default: 'gallery')
 */
export async function deleteFile(publicUrl: string, bucket: string = 'gallery'): Promise<void> {
  try {
    // Extract filename from URL
    const urlParts = publicUrl.split('/');
    const filename = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filename]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}
