require('dotenv').config();

const hoge = async function (context) {
    context.log("JavaScript HTTP trigger function processed a request.");

    // Importing required node.js modules
    var batch = require("azure-batch");

    // Replace values below with Batch Account details
    var accountName = process.env.BATCH_ACCOUNT_NAME;
    var accountKey = process.env.BATCH_ACCOUNT_KEY;
    var accountUrl = process.env.BATCH_ACCOUNT_URL;

    // Replace values with SAS URIs of the shell script file
    var sh_url = process.env.BATCH_SH_URL;
    
    // Replace values with SAS URIs of the Python script file
    var scriptURI = process.env.BATCH_SCRIPT_URL;
    
    // Pool ID
    var poolId = process.env.BATCH_POOL_ID;

    // Job ID
    var now = new Date();
    var jobId = "processcsvjob_" +
        now.getFullYear() +
        now.getMonth() +
        now.getDay() +
        now.getHours() +
        now.getSeconds();

    // Create Batch credentials object using account name and account key
    var credentials = new batch.SharedKeyCredentials(accountName, accountKey);

    // Create Batch service client
    var batchClient = new batch.ServiceClient(credentials, accountUrl);

    var poolConfig = {};

    // Creating Batch Pool
    context.log("Getting pool with ID : " + poolId);

    var pool = await batchClient.pool.get(poolId, poolConfig);

    context.log("Creating job with ID : " + jobId);
    // Preparation Task configuraion object
    var jobPrepTaskConfig = {
        id: "installprereq",
        commandLine: "sudo sh startup_prereq.sh > startup.log",
        resourceFiles: [{ httpUrl: sh_url, filePath: "startup_prereq.sh" }],
        waitForSuccess: true,
        runElevated: true,
        userIdentity: {
            autoUser: {
                scope: "pool",
                elevationLevel: "admin"
            }
        }
    };

    // Setting Batch Pool ID
    var poolInfo = { poolId };
    // Batch job configuration object
    var jobConfig = {
        id: jobId,
        displayName: "process csv files",
        jobPreparationTask: jobPrepTaskConfig,
        poolInfo: poolInfo,
        onAllTasksComplete: "terminateJob",
        onTaskFailure: "noAction"
    };

    // Submitting Batch Job

    var job = await batchClient.job.add(jobConfig);

    context.log("Creating tasks....");
    // Task configuration object
    var taskConfig = {
        id: "con1_process",
        displayName: "process csv in con1",
        commandLine: "sh process.sh",
        resourceFiles: [{ httpUrl: scriptURI, filePath: "process.sh" }],
        outputFiles: [{ 
            filePattern: "nem2-peers-graph/dist-peers/*",
            destination: {
                container: {
                    path: 'nem2-peers-graph/dist-peers',
                    containerUrl: process.env.BATCH_UPLOAD_URL
                }
            },
            uploadOptions: {
                uploadCondition: "taskCompletion"
            }
         }]
    };

    var task = await batchClient
        .task
        .add(jobId, taskConfig)
        .catch((e) => {
            console.error(e);
        });
    context.log(
        "Task submitted successfully"
    );

};

const context = {
    log: console.log
}

hoge(context);