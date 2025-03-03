-- CreateTable
CREATE TABLE `monsters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `meta` TEXT NOT NULL,
    `armor_class` TEXT NOT NULL,
    `hit_points` TEXT NOT NULL,
    `speed` TEXT NOT NULL,
    `str` TEXT NOT NULL,
    `str_mod` TEXT NOT NULL,
    `dex` TEXT NOT NULL,
    `dex_mod` TEXT NOT NULL,
    `con` TEXT NOT NULL,
    `con_mod` TEXT NOT NULL,
    `intelligence` TEXT NOT NULL,
    `intelligence_mod` TEXT NOT NULL,
    `wis` TEXT NOT NULL,
    `wis_mod` TEXT NOT NULL,
    `cha` TEXT NOT NULL,
    `cha_mod` TEXT NOT NULL,
    `skills` TEXT NULL,
    `senses` TEXT NULL,
    `languages` TEXT NULL,
    `challenge` TEXT NOT NULL,
    `traits` TEXT NULL,
    `actions` TEXT NULL,
    `img_url` TEXT NULL,

    UNIQUE INDEX `monsters_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `encounters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `encounter_monsters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `encounter_id` INTEGER NOT NULL,
    `monster_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `encounter_monsters` ADD CONSTRAINT `encounter_monsters_encounter_id_fkey` FOREIGN KEY (`encounter_id`) REFERENCES `encounters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `encounter_monsters` ADD CONSTRAINT `encounter_monsters_monster_id_fkey` FOREIGN KEY (`monster_id`) REFERENCES `monsters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
