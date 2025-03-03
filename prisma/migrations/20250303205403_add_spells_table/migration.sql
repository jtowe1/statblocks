-- CreateTable
CREATE TABLE `spells` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `spell_name` VARCHAR(191) NOT NULL,
    `ritual` BOOLEAN NOT NULL DEFAULT false,
    `school` VARCHAR(191) NOT NULL,
    `tags` VARCHAR(191) NULL,
    `level` INTEGER NOT NULL,
    `casting_time` VARCHAR(191) NOT NULL,
    `range` VARCHAR(191) NOT NULL,
    `components` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `classes` VARCHAR(191) NOT NULL,
    `source_book` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `spells_spell_name_key`(`spell_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
