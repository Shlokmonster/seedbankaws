import pool from '../config/db.js';
import { logActivity } from '../services/activityLogService.js';

// @desc    Get all seeds with search, filter, sort, pagination
// @route   GET /api/seeds
// @access  Private (Admin, Manager, Staff)
export const getSeeds = async (req, res, next) => {
  try {
    const { search, category, status, region, sortBy, sortOrder, page = 1, limit = 8 } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const offset = (parsedPage - 1) * parsedLimit;

    let queryText = 'SELECT *, COUNT(*) OVER() AS total_count FROM seed_details_view';
    const conditions = [];
    const params = [];

    // Search filter
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(seed_name ILIKE $${params.length} OR species ILIKE $${params.length} OR region ILIKE $${params.length})`);
    }

    // Category filter
    if (category) {
      params.push(category);
      conditions.push(`genetic_category = $${params.length}`);
    }

    // Status filter
    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    // Region filter
    if (region) {
      params.push(region);
      conditions.push(`region = $${params.length}`);
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    // Sorting
    const allowedSortFields = ['seed_name', 'species', 'genetic_category', 'quantity', 'region', 'preservation_status', 'status', 'created_at'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
    queryText += ` ORDER BY ${sortField} ${order}`;

    // Pagination
    params.push(parsedLimit);
    queryText += ` LIMIT $${params.length}`;
    
    params.push(offset);
    queryText += ` OFFSET $${params.length}`;

    const result = await pool.query(queryText, params);
    
    const seeds = result.rows.map(row => {
      const { total_count, ...seed } = row;
      return seed;
    });

    const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count, 10) : 0;
    const totalPages = Math.ceil(totalCount / parsedLimit);

    res.json({
      seeds,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: parsedPage,
        limit: parsedLimit
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single seed by ID
// @route   GET /api/seeds/:id
// @access  Private (Admin, Manager, Staff)
export const getSeedById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM seed_details_view WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Seed not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new seed
// @route   POST /api/seeds
// @access  Private (Admin, Manager, Staff)
export const createSeed = async (req, res, next) => {
  const { seed_name, species, genetic_category, quantity, region, preservation_status, status, description } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO seeds (seed_name, species, genetic_category, quantity, region, preservation_status, status, description, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        seed_name,
        species,
        genetic_category,
        quantity || 0,
        region,
        preservation_status,
        status || 'Active',
        description || '',
        req.user.id
      ]
    );

    const newSeed = result.rows[0];

    // Log seed creation
    await logActivity(req.user.id, `Seed created: ${newSeed.seed_name} (${newSeed.species})`, 'Seed Management');

    res.status(201).json(newSeed);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a seed
// @route   PUT /api/seeds/:id
// @access  Private (Admin, Manager, Staff)
export const updateSeed = async (req, res, next) => {
  const { id } = req.params;
  const { seed_name, species, genetic_category, quantity, region, preservation_status, status, description } = req.body;

  try {
    // Check if seed exists
    const checkSeed = await pool.query('SELECT seed_name FROM seeds WHERE id = $1', [id]);
    if (checkSeed.rows.length === 0) {
      return res.status(404).json({ message: 'Seed not found' });
    }

    const result = await pool.query(
      `UPDATE seeds 
       SET seed_name = $1, species = $2, genetic_category = $3, quantity = $4, 
           region = $5, preservation_status = $6, status = $7, description = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        seed_name,
        species,
        genetic_category,
        quantity,
        region,
        preservation_status,
        status,
        description,
        id
      ]
    );

    const updatedSeed = result.rows[0];

    // Log seed update
    await logActivity(req.user.id, `Seed updated: ${updatedSeed.seed_name}`, 'Seed Management');

    res.json(updatedSeed);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a seed
// @route   DELETE /api/seeds/:id
// @access  Private (Admin, Manager)
export const deleteSeed = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if seed exists
    const checkSeed = await pool.query('SELECT seed_name FROM seeds WHERE id = $1', [id]);
    if (checkSeed.rows.length === 0) {
      return res.status(404).json({ message: 'Seed not found' });
    }

    const seedToDelete = checkSeed.rows[0];

    await pool.query('DELETE FROM seeds WHERE id = $1', [id]);

    // Log seed deletion
    await logActivity(req.user.id, `Seed deleted: ${seedToDelete.seed_name}`, 'Seed Management');

    res.json({ message: 'Seed deleted successfully' });
  } catch (error) {
    next(error);
  }
};
