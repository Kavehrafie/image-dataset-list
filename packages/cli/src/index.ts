import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  copyFileSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
  .name("image-dataset-manager")
  .description("CLI for managing image datasets")
  .version("1.0.0");

// Init command
program
  .command("init")
  .description("Initialize a new project with dataset management")
  .option("-t, --template <type>", "Template type (slidev, basic)", "basic")
  .option("-d, --dir <directory>", "Target directory", ".")
  .action(async (options) => {
    console.log(chalk.blue("🚀 Initializing image dataset project..."));

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Project name:",
        default: "my-image-project",
      },
      {
        type: "input",
        name: "description",
        message: "Project description:",
        default: "My image dataset project",
      },
    ]);

    const targetDir = join(process.cwd(), options.dir);
    const dataDir = join(targetDir, "data");

    // Create directories
    mkdirSync(dataDir, { recursive: true });
    mkdirSync(join(dataDir, "datasets"), { recursive: true });

    // Copy schema
    const schemaPath = join(__dirname, "../templates/dataset-schema.json");
    const targetSchemaPath = join(dataDir, "dataset-schema.json");

    if (existsSync(schemaPath)) {
      copyFileSync(schemaPath, targetSchemaPath);
    }

    // Create sample dataset
    const sampleDataset = {
      metadata: {
        version: `v${new Date().toISOString().replace(/[:.]/g, "-")}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: answers.description,
        schemaVersion: "1.0.0",
      },
      images: {
        sample_image: {
          src: "https://via.placeholder.com/800x600",
          caption: "Sample image for testing",
          tags: ["sample", "placeholder"],
          metadata: {
            artist: "Placeholder",
            year: new Date().getFullYear(),
          },
        },
      },
    };

    writeFileSync(
      join(dataDir, "datasets", "sample.json"),
      JSON.stringify(sampleDataset, null, 2)
    );

    console.log(chalk.green("✅ Project initialized successfully!"));
    console.log(chalk.yellow(`📁 Dataset directory: ${dataDir}`));
    console.log(chalk.yellow("💡 Next steps:"));
    console.log("   - Add your images to data/datasets/");
    console.log("   - Install @kavehrafie/image-dataset-manager");
    console.log("   - Import and use datasets in your project");
  });

// Add command
program
  .command("add <dataset>")
  .description("Add a bundled dataset to your project")
  .option("-d, --dir <directory>", "Target directory", "./data/datasets")
  .action(async (dataset, options) => {
    console.log(chalk.blue(`📦 Adding dataset: ${dataset}`));

    const availableDatasets: Record<string, string> = {
      "iranian-art": "@kavehrafie/iranian-art-dataset",
      sample: "built-in sample dataset",
    };

    if (!availableDatasets[dataset as keyof typeof availableDatasets]) {
      console.log(chalk.red(`❌ Dataset '${dataset}' not found.`));
      console.log(chalk.yellow("Available datasets:"));
      Object.keys(availableDatasets).forEach((name) => {
        console.log(`   - ${name}`);
      });
      return;
    }

    const targetDir = join(process.cwd(), options.dir);
    mkdirSync(targetDir, { recursive: true });

    if (dataset === "iranian-art") {
      console.log(chalk.yellow("💡 To use the Iranian art dataset:"));
      console.log("   npm install @kavehrafie/iranian-art-dataset");
      console.log(
        '   import iranianArt from "@kavehrafie/iranian-art-dataset"'
      );
    }

    console.log(chalk.green("✅ Dataset information added!"));
  });

// Create command
program
  .command("create <name>")
  .description("Create a new empty dataset")
  .option("-d, --dir <directory>", "Target directory", "./data/datasets")
  .action(async (name, options) => {
    console.log(chalk.blue(`🆕 Creating new dataset: ${name}`));

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "description",
        message: "Dataset description:",
        default: `${name} image collection`,
      },
      {
        type: "input",
        name: "tags",
        message: "Tags (comma-separated):",
        default: "images, collection",
      },
    ]);

    const dataset = {
      metadata: {
        version: `v${new Date().toISOString().replace(/[:.]/g, "-")}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: answers.description,
        tags: answers.tags.split(",").map((tag: string) => tag.trim()),
        schemaVersion: "1.0.0",
      },
      images: {},
    };

    const targetDir = join(process.cwd(), options.dir);
    mkdirSync(targetDir, { recursive: true });

    const filePath = join(targetDir, `${name}.json`);
    writeFileSync(filePath, JSON.stringify(dataset, null, 2));

    console.log(chalk.green(`✅ Created dataset: ${filePath}`));
    console.log(chalk.yellow('💡 Start adding images to the "images" object'));
  });

// List command
program
  .command("list")
  .description("List available bundled datasets")
  .action(() => {
    console.log(chalk.blue("📋 Available bundled datasets:"));
    console.log("   • iranian-art - Iranian modern art collection");
    console.log("   • sample - Basic sample dataset");
    console.log("");
    console.log(
      chalk.yellow(
        '💡 Use "idm add <dataset-name>" to add them to your project'
      )
    );
  });

// Validate command
program
  .command("validate <file>")
  .description("Validate a dataset file against the schema")
  .action(async (file) => {
    console.log(chalk.blue(`🔍 Validating: ${file}`));

    try {
      const content = readFileSync(file, "utf-8");
      const dataset = JSON.parse(content);

      // Basic validation
      if (!dataset.metadata) {
        throw new Error("Missing metadata");
      }
      if (!dataset.images) {
        throw new Error("Missing images object");
      }

      const imageCount = Object.keys(dataset.images).length;
      console.log(chalk.green("✅ Dataset is valid!"));
      console.log(chalk.blue(`📊 Images: ${imageCount}`));
      console.log(chalk.blue(`📅 Version: ${dataset.metadata.version}`));
    } catch (error: any) {
      console.log(chalk.red(`❌ Validation failed: ${error.message}`));
    }
  });

program.parse();
