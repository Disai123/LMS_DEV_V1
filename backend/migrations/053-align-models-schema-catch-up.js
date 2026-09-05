'use strict';

/**
 * 053 — Align migrations with Sequelize models + live schema.
 * Idempotent: safe on DBs that already got these via sync/scripts.
 *
 * Covers gaps where models exist but earlier migrations were missing/stubbed:
 * - contact_messages table
 * - videos table
 * - internships.start_date / end_date
 * - course_chapters.pdf_url
 * - projects phase video/document URL + upload metadata columns
 * - test_questions.is_active
 * - test_attempts.completed_at / time_taken_minutes
 * - file_uploads.updated_at, activity_logs.updated_at
 * - group_members member fields (if bare join table)
 * - hackathon_group_members.added_by
 */

const tableExists = async (qi, table) => {
  const [rows] = await qi.sequelize.query(`
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = :table
    LIMIT 1
  `, { replacements: { table } });
  return rows.length > 0;
};

const columnExists = async (qi, table, column) => {
  const [rows] = await qi.sequelize.query(`
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = :table AND column_name = :column
    LIMIT 1
  `, { replacements: { table, column } });
  return rows.length > 0;
};

const addColumnIfMissing = async (qi, Sequelize, table, column, definition) => {
  if (!(await tableExists(qi, table))) {
    console.log(`ℹ️ Skip ${table}.${column} — table missing`);
    return;
  }
  if (await columnExists(qi, table, column)) {
    console.log(`ℹ️ ${table}.${column} already exists`);
    return;
  }
  await qi.addColumn(table, column, definition);
  console.log(`✅ Added ${table}.${column}`);
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // --- contact_messages ---
    if (!(await tableExists(queryInterface, 'contact_messages'))) {
      await queryInterface.createTable('contact_messages', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        name: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false },
        subject: { type: Sequelize.STRING, allowNull: false },
        message: { type: Sequelize.TEXT, allowNull: false },
        status: {
          type: Sequelize.ENUM('unread', 'read', 'replied', 'archived'),
          defaultValue: 'unread'
        },
        ip_address: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false }
      });
      console.log('✅ Created contact_messages');
    } else {
      console.log('ℹ️ contact_messages already exists');
    }

    // --- videos ---
    if (!(await tableExists(queryInterface, 'videos'))) {
      await queryInterface.createTable('videos', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        project_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'projects', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        title: { type: Sequelize.STRING(255), allowNull: false },
        description: { type: Sequelize.TEXT, allowNull: true },
        video_url: { type: Sequelize.STRING(500), allowNull: false },
        thumbnail_url: { type: Sequelize.STRING(500), allowNull: true },
        video_type: {
          type: Sequelize.ENUM('overview', 'phase'),
          allowNull: false
        },
        phase: { type: Sequelize.STRING(50), allowNull: true },
        phase_number: { type: Sequelize.INTEGER, allowNull: true },
        duration: { type: Sequelize.INTEGER, allowNull: true },
        view_count: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        tags: { type: Sequelize.JSON, allowNull: true },
        uploaded_by: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        updated_by: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false }
      });
      await queryInterface.addIndex('videos', ['project_id']);
      await queryInterface.addIndex('videos', ['video_type']);
      await queryInterface.addIndex('videos', ['phase']);
      await queryInterface.addIndex('videos', ['phase_number']);
      await queryInterface.addIndex('videos', ['uploaded_by']);
      console.log('✅ Created videos');
    } else {
      console.log('ℹ️ videos already exists');
    }

    // --- internships dates ---
    await addColumnIfMissing(queryInterface, Sequelize, 'internships', 'start_date', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await addColumnIfMissing(queryInterface, Sequelize, 'internships', 'end_date', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // --- course_chapters.pdf_url ---
    await addColumnIfMissing(queryInterface, Sequelize, 'course_chapters', 'pdf_url', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // --- projects phase media / upload metadata ---
    const projectTextCols = [
      'overview_video_url',
      'brd_video_url',
      'uiux_video_url',
      'architectural_video_url',
      'code_development_video_url',
      'testing_video_url',
      'deployment_video_url',
      'brd_document_url',
      'uiux_document_url',
      'architectural_document_url',
      'code_development_document_url',
      'testing_document_url',
      'deployment_document_url'
    ];
    for (const col of projectTextCols) {
      await addColumnIfMissing(queryInterface, Sequelize, 'projects', col, {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
    await addColumnIfMissing(queryInterface, Sequelize, 'projects', 'video_uploads', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {}
    });
    await addColumnIfMissing(queryInterface, Sequelize, 'projects', 'document_uploads', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {}
    });
    await addColumnIfMissing(queryInterface, Sequelize, 'projects', 'videos_last_updated', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await addColumnIfMissing(queryInterface, Sequelize, 'projects', 'documents_last_updated', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await addColumnIfMissing(queryInterface, Sequelize, 'projects', 'videos_uploaded_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await addColumnIfMissing(queryInterface, Sequelize, 'projects', 'documents_uploaded_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // --- test_questions.is_active ---
    await addColumnIfMissing(queryInterface, Sequelize, 'test_questions', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });

    // --- test_attempts timing fields used by model ---
    await addColumnIfMissing(queryInterface, Sequelize, 'test_attempts', 'completed_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await addColumnIfMissing(queryInterface, Sequelize, 'test_attempts', 'time_taken_minutes', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    });

    // --- timestamps expected by models ---
    await addColumnIfMissing(queryInterface, Sequelize, 'file_uploads', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await addColumnIfMissing(queryInterface, Sequelize, 'activity_logs', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    // --- group_members (in case only bare join table exists) ---
    if (await tableExists(queryInterface, 'group_members')) {
      if (!(await columnExists(queryInterface, 'group_members', 'id'))) {
        await queryInterface.sequelize.query(`
          ALTER TABLE group_members ADD COLUMN id SERIAL
        `);
        const [pks] = await queryInterface.sequelize.query(`
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_schema='public' AND table_name='group_members'
            AND constraint_type='PRIMARY KEY'
        `);
        if (!pks.length) {
          await queryInterface.sequelize.query(
            `ALTER TABLE group_members ADD PRIMARY KEY (id)`
          );
        }
        console.log('✅ Added group_members.id');
      }
      await addColumnIfMissing(queryInterface, Sequelize, 'group_members', 'joined_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
      await addColumnIfMissing(queryInterface, Sequelize, 'group_members', 'is_leader', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      });
      await addColumnIfMissing(queryInterface, Sequelize, 'group_members', 'status', {
        type: Sequelize.ENUM('active', 'inactive', 'pending'),
        allowNull: false,
        defaultValue: 'active'
      });
      await addColumnIfMissing(queryInterface, Sequelize, 'group_members', 'added_by', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }

    // --- hackathon_group_members.added_by ---
    await addColumnIfMissing(queryInterface, Sequelize, 'hackathon_group_members', 'added_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // --- internship_submissions (migration 049 may not have run) ---
    if (!(await tableExists(queryInterface, 'internship_submissions'))) {
      await queryInterface.createTable('internship_submissions', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        student_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        internship_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'internships', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        internship_title: { type: Sequelize.STRING(255), allowNull: false },
        github_url: { type: Sequelize.STRING(500), allowNull: true },
        drive_url: { type: Sequelize.STRING(500), allowNull: true },
        documentation_url: { type: Sequelize.STRING(500), allowNull: true },
        description: { type: Sequelize.TEXT, allowNull: true },
        status: {
          type: Sequelize.ENUM('pending', 'approved', 'rejected', 'revision_requested'),
          allowNull: false,
          defaultValue: 'pending'
        },
        submitted_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        reviewed_at: { type: Sequelize.DATE, allowNull: true },
        reviewed_by: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        admin_feedback: { type: Sequelize.TEXT, allowNull: true },
        points_awarded: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false }
      });
      await queryInterface.addIndex('internship_submissions', ['student_id']);
      await queryInterface.addIndex('internship_submissions', ['internship_id']);
      await queryInterface.addIndex('internship_submissions', ['status']);
      await queryInterface.addIndex(
        'internship_submissions',
        ['student_id', 'internship_id'],
        { unique: true, name: 'unique_student_internship_submission' }
      );
      console.log('✅ Created internship_submissions');
    } else {
      console.log('ℹ️ internship_submissions already exists');
    }

    console.log('✅ Migration 053 complete — models / DB / migrations aligned');
  },

  down: async () => {
    console.log('⚠️ Skipping rollback for data safety');
  }
};
