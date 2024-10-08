import { Iterable, Pre, ToStringFunctions, Type, isFunction } from "@everyonesoftware/base-typescript";
import { AssertTest } from "./assertTest";
import { Test, TestRunner, TestSkip } from "@everyonesoftware/test-typescript";
import * as mocha from "mocha";
/**
 * A {@link TestRunner} implementation that passes through to mocha.
 */
export class MochaTestRunner implements TestRunner
{
    private currentTest: Test | undefined;
    private toStringFunctions: ToStringFunctions;

    protected constructor(toStringFunctions?: ToStringFunctions)
    {
        if (!toStringFunctions)
        {
            toStringFunctions = ToStringFunctions.create();
        }
        this.toStringFunctions = toStringFunctions;
    }

    public static create(toStringFunctions?: ToStringFunctions): MochaTestRunner
    {
        return new MochaTestRunner(toStringFunctions);
    }

    private getCurrentTest(): Test | undefined
    {
        return this.currentTest;
    }

    private setCurrentTest(currentTest: Test | undefined): void
    {
        this.currentTest = currentTest;
    }

    private assertNoCurrentTest(): void
    {
        const currentTest: Test | undefined = this.getCurrentTest();
        if (currentTest !== undefined)
        {
            currentTest.fail("Can't start a new test group or a new test while running a test.");
        }
    }

    public skip(shouldSkip?: boolean, message?: string): TestSkip
    {
        return TestRunner.skip(this, shouldSkip, message);
    }

    public testFile(fileName: string, testAction: (() => void) | ((test: Test) => void)): void;
    public testFile(fileName: string, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void;
    public testFile(fileName: string, skipOrTestAction: TestSkip | (() => void) | ((test: Test) => void) | undefined, testAction?: ((() => void) | ((test: Test) => void)) | undefined): void
    {
        TestRunner.testFile(this, fileName, skipOrTestAction, testAction);
    }

    public testType(typeNameOrType: string | Type<unknown>, testAction: (() => void) | ((test: Test) => void)): void;
    public testType(typeNameOrType: string | Type<unknown>, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void;
    public testType(typeNameOrType: string | Type<unknown>, skipOrTestAction: TestSkip | (() => void) | ((test: Test) => void) | undefined, testAction?: ((() => void) | ((test: Test) => void)) | undefined): void
    {
        TestRunner.testType(this, typeNameOrType, skipOrTestAction, testAction);
    }

    public testFunction(functionSignature: string, testAction: (() => void) | ((test: Test) => void)): void;
    public testFunction(functionSignature: string, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void;
    public testFunction(functionSignature: string, skipOrTestAction: TestSkip | (() => void) | ((test: Test) => void) | undefined, testAction?: ((() => void) | ((test: Test) => void)) | undefined): void
    {
        TestRunner.testFunction(this, functionSignature, skipOrTestAction, testAction);
    }

    public testGroup(testGroupName: string, testAction: () => void): void;
    public testGroup(testGroupName: string, skip: TestSkip | undefined, testAction: () => void): void;
    testGroup(testGroupName: string, skipOrTestAction: TestSkip | undefined | (() => void), testAction?: () => void): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(testGroupName, "testGroupName");
        Pre.condition.assertNotEmpty(testGroupName, "testGroupName");
        let skip: TestSkip | undefined;
        if (isFunction(skipOrTestAction))
        {
            Pre.condition.assertUndefined(testAction, "testAction");

            skip = undefined;
            testAction = skipOrTestAction;
        }
        else
        {
            skip = skipOrTestAction;
        }
        Pre.condition.assertNotUndefinedAndNotNull(testAction, "testAction");

        this.assertNoCurrentTest();

        mocha.suite(testGroupName, function()
        {
            if (TestRunner.shouldSkip(skip))
            {
                mocha.beforeEach(function()
                {
                    // Calls the mocha skip() function instead of MochaTestRunner.skip().
                    // https://mochajs.org/#inclusive-tests
                    this.skip();
                });
            }

            testAction();
        });
    }

    public test(testName: string, testAction: (test: Test) => void): void;
    public test(testName: string, skip: TestSkip | undefined, testAction: (test: Test) => void): void;
    test(testName: string, skipOrTestAction: TestSkip | undefined | ((test: Test) => void), testAction?: (test: Test) => void): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(testName, "testName");
        Pre.condition.assertNotEmpty(testName, "testName");
        let skip: TestSkip | undefined;
        if (isFunction(skipOrTestAction))
        {
            Pre.condition.assertUndefined(testAction, "testAction");

            skip = undefined;
            testAction = skipOrTestAction;
        }
        else
        {
            skip = skipOrTestAction;
        }
        Pre.condition.assertNotUndefinedAndNotNull(testAction, "testAction");

        this.assertNoCurrentTest();

        const runner: MochaTestRunner = this;
        mocha.test(testName, function()
        {
            if (TestRunner.shouldSkip(skip))
            {
                // Calls the mocha skip() function instead of MochaTestRunner.skip().
                // https://mochajs.org/#inclusive-tests
                this.skip();
            }
            else
            {
                const currentTest: Test = AssertTest.create();
                runner.setCurrentTest(currentTest);
                try
                {
                    testAction(currentTest);
                }
                finally
                {
                    runner.setCurrentTest(undefined);
                }
            }
        });
    }

    public testAsync(testName: string, testAction: (test: Test) => Promise<unknown>): void;
    public testAsync(testName: string, skip: TestSkip | undefined, testAction: (test: Test) => Promise<unknown>): void;
    testAsync(testName: string, skipOrTestAction: TestSkip | undefined | ((test: Test) => Promise<unknown>), testAction?: (test: Test) => Promise<unknown>): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(testName, "testName");
        Pre.condition.assertNotEmpty(testName, "testName");
        let skip: TestSkip | undefined;
        if (isFunction(skipOrTestAction))
        {
            Pre.condition.assertUndefined(testAction, "testAction");

            skip = undefined;
            testAction = skipOrTestAction;
        }
        else
        {
            skip = skipOrTestAction;
        }
        Pre.condition.assertNotUndefinedAndNotNull(testAction, "testAction");

        mocha.test(testName, async function()
        {
            if (TestRunner.shouldSkip(skip))
            {
                // Calls the mocha skip() function instead of MochaTestRunner.skip().
                // https://mochajs.org/#inclusive-tests
                this.skip();
            }
            else
            {
                await testAction(AssertTest.create());
            }
        });
    }

    public andList(values: unknown[] | Iterable<unknown>): string
    {
        Pre.condition.assertNotUndefinedAndNotNull(values, "values");

        return TestRunner.andList(this, values);
    }

    public toString(value: unknown): string
    {
        return this.toStringFunctions.toString(value);
    }
}