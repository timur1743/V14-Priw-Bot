module.exports = {

    apps: [
      {
        name: `Priv Bot`,
        namespace: `tkcuk`,
        script: "tk.js",
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Bot/",
      }
    ]
  };
  