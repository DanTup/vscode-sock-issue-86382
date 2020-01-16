import * as path from "path";
import * as vstest from "vscode-test";

let exitCode = 0;
const cwd = process.cwd();
const testEnv = Object.create(process.env);

async function runTests(testFolder: string, workspaceFolder: string, env?: {}): Promise<void> {
	console.log(`Running ${testFolder} tests folder in workspace ${workspaceFolder}`);

	try {
		const res = await vstest.runTests({
			extensionDevelopmentPath: cwd,
			extensionTestsEnv: { ...testEnv, ...env },
			extensionTestsPath: path.join(cwd, "out", "src", "test", testFolder),
			launchArgs: [
				path.join(cwd, "src", "test", "test_projects", workspaceFolder),
				"--user-data-dir",
				path.join(cwd, ".test_data_dir"),
			],
			version: process.env.CODE_VERSION,
		});
		exitCode = exitCode || res;
	} catch (e) {
		console.error(e);
		exitCode = exitCode || 999;
	}
}

async function runAllTests(): Promise<void> {

	try {
		await runTests("test1", "empty");
		await new Promise((resolve) => setTimeout(resolve, 5000));
		await runTests("test2", "empty");
	} catch (e) {
		exitCode = 1;
		console.error(e);
	}
}

runAllTests().then(() => process.exit(exitCode));
