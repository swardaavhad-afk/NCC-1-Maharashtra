// =============================================
// Study Material Controller
// =============================================
const { supabaseAdmin, uploadFile, getPublicUrl, deleteFile } = require('../config/supabase');

// @desc    Get all study materials
// @route   GET /api/study-materials
exports.getAllMaterials = async (req, res, next) => {
  try {
    const { category, year, page = 1, limit = 50 } = req.query;
    const pageNum = parseInt(page);
    const pageLimit = parseInt(limit);
    const offset = (pageNum - 1) * pageLimit;

    let query = supabaseAdmin
      .from('study_materials')
      .select('*, users(full_name)', { count: 'exact' });

    if (category) query = query.eq('category', category);
    if (year) query = query.eq('year', year);

    const { data: materials, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageLimit - 1);

    if (!materials) return res.status(500).json({ error: 'Failed to fetch materials' });

    res.json({
      materials,
      total: count,
      page: pageNum,
      pages: Math.ceil(count / pageLimit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload study material (file or Google Drive link)
// @route   POST /api/study-materials
exports.createMaterial = async (req, res, next) => {
  try {
    const { title, description, category, year, drive_link } = req.body;

    // Validate required fields
    if (!title || !description || !category || !year) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, description, category, year' 
      });
    }

    // Ensure either file or drive_link is provided
    if (!req.file && !drive_link) {
      return res.status(400).json({ 
        error: 'Either file upload or drive_link is required' 
      });
    }

    let fileUrl = null;
    let fileName = null;
    let fileSize = null;
    let fileType = null;

    // Handle file upload
    if (req.file) {
      try {
        const timestamp = Date.now();
        const filePath = `study-materials/${timestamp}-${req.file.originalname}`;

        // Upload to Supabase storage
        await uploadFile('study-materials', filePath, req.file.buffer, req.file.mimetype);

        // Get public URL
        fileUrl = getPublicUrl('study-materials', filePath);
        fileName = req.file.originalname;
        fileSize = req.file.size;
        fileType = req.file.mimetype;
      } catch (uploadError) {
        return res.status(400).json({ 
          error: `File upload failed: ${uploadError.message}` 
        });
      }
    }

    // Insert into database
    const { data: material, error } = await supabaseAdmin
      .from('study_materials')
      .insert([{
        title,
        description,
        category,
        year,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        file_type: fileType,
        drive_link: drive_link || null,
        download_count: 0,
        uploaded_by: req.user.id
      }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(material);
  } catch (error) {
    next(error);
  }
};

// @desc    Update study material (file or fields)
// @route   PUT /api/study-materials/:id
exports.updateMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, category, year, drive_link } = req.body;

    // Fetch current material to get existing file info
    const { data: currentMaterial, error: fetchError } = await supabaseAdmin
      .from('study_materials')
      .select()
      .eq('id', id)
      .single();

    if (fetchError || !currentMaterial) {
      return res.status(404).json({ error: 'Material not found' });
    }

    let updateData = {};

    // Only add provided fields to update data
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (year) updateData.year = year;
    if (drive_link !== undefined) updateData.drive_link = drive_link || null;

    // Handle file upload
    if (req.file) {
      try {
        // Delete old file from storage if it exists
        if (currentMaterial.file_url) {
          const oldFilePath = currentMaterial.file_name 
            ? `study-materials/${currentMaterial.file_name}`
            : null;
          if (oldFilePath) {
            try {
              await deleteFile('study-materials', [oldFilePath]);
            } catch (deleteError) {
              console.warn('Failed to delete old file:', deleteError.message);
            }
          }
        }

        // Upload new file
        const timestamp = Date.now();
        const filePath = `study-materials/${timestamp}-${req.file.originalname}`;
        await uploadFile('study-materials', filePath, req.file.buffer, req.file.mimetype);

        // Get public URL
        const fileUrl = getPublicUrl('study-materials', filePath);
        updateData.file_url = fileUrl;
        updateData.file_name = req.file.originalname;
        updateData.file_size = req.file.size;
        updateData.file_type = req.file.mimetype;
      } catch (uploadError) {
        return res.status(400).json({ 
          error: `File upload failed: ${uploadError.message}` 
        });
      }
    }

    // Update in database
    const { data: material, error } = await supabaseAdmin
      .from('study_materials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !material) return res.status(404).json({ error: 'Material not found' });
    res.json(material);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete study material
// @route   DELETE /api/study-materials/:id
exports.deleteMaterial = async (req, res, next) => {
  try {
    // Fetch material before deletion to get file info
    const { data: material, error: fetchError } = await supabaseAdmin
      .from('study_materials')
      .select()
      .eq('id', req.params.id)
      .single();

    if (fetchError || !material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Delete from storage if file_url exists
    if (material.file_url && material.file_name) {
      try {
        const filePath = `study-materials/${material.file_name}`;
        await deleteFile('study-materials', [filePath]);
      } catch (deleteError) {
        console.warn('Failed to delete file from storage:', deleteError.message);
      }
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('study_materials')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) return res.status(400).json({ error: deleteError.message });

    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment download count
// @route   POST /api/study-materials/:id/download
exports.incrementDownload = async (req, res, next) => {
  try {
    // Fetch current download count
    const { data: current, error: fetchError } = await supabaseAdmin
      .from('study_materials')
      .select('download_count')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !current) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Increment and update
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('study_materials')
      .update({ download_count: (current.download_count || 0) + 1 })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError || !updated) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

