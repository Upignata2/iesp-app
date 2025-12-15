import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ugybcgubtvrjyodcegei.supabase.co';
const supabaseAnonKey = 'sb_publishable_nShPs5nsxdNzxQ4PnkxDfg_18aZH9s1';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
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
