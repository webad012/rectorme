import * as assert from 'assert';
import * as vscode from 'vscode';
import * as RectorMeExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Invalid test', () => {
		const demoInvalidRectorSource = `
1 file with changes
===================

1) ../../mnt/second_disk/vsc_extensions/vscrectorme/src/test/demoInvalid.php:0

	---------- begin diff ----------
@@ @@
	<?php

-class TestClass
+final class TestClass
	{
-    private $privatevar = 'default value';
+    private string $privatevar = 'default value';

		public function getprivatevar()
		{
	----------- end diff -----------

Applied rules:
	* FinalizeClassesWithoutChildrenRector
	* TypedPropertyFromAssignsRector


	[OK] 1 file would have changed (dry-run) by Rector                             

`;
		
		const [greenDecorationsArray, redDecorationsArray] = RectorMeExtension.generateDecorations(demoInvalidRectorSource);

		assert.strictEqual(2, greenDecorationsArray.length);
    	assert.strictEqual(2, redDecorationsArray.length);

		assert.strictEqual(11, greenDecorationsArray[0].range.start.line);
		assert.strictEqual(14, greenDecorationsArray[1].range.start.line);
		assert.strictEqual(10, redDecorationsArray[0].range.start.line);
		assert.strictEqual(13, redDecorationsArray[1].range.start.line);
	});

	test('Valid test', () => {
		const demoInvalidRectorSource = '';

		const [greenDecorationsArray, redDecorationsArray] = RectorMeExtension.generateDecorations(demoInvalidRectorSource);

		assert.strictEqual(0, greenDecorationsArray.length);
    	assert.strictEqual(0, redDecorationsArray.length);
	});
});

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }
