declare module 'nodegit' {
  export namespace Enums {
    enum DIRECTION {
      FETCH = 0, 
      PUSH = 1
    }
  }

  /**
   * Represents the signature of a Git user.
   */
  export class Signature {
    /**
     * Constructs a new signature with the current date and time.
     * @param name the name of the user
     * @param email the email of the user
     */
    static now(name: string, email: string): Signature;
  }

  export class Repository {
    /**
     * Opens a repository and returns it.
     * @param path the path to the .git of the repository.
     */
    static open(path: string): Promise<Repository>;

    /**
     * Finds an exisiting remote.
     * @param name the name of the Remote
     * @param callback unknown purpose
     */
    getRemote(name: string, callback: Function): Promise<Remote>;


    /**
     * Returns a commit OID (or string) by reference.
     * @param ref the reference to the commit.
     */
    getCommit(ref: string | Oid): Promise<string | Oid>;

    /**
     * Produces a fresh copy of the repository index
     */
    refreshIndex(): Promise<Index>;

    /**
     * @param updateRef the ref to commit after.
     * @param author signature of the authorer off the commit
     * @param committer signature of the committer
     * @param tree TODO
     * @param parent TODO
     */
    createCommit(updateRef: string, author: Signature, committer: Signature, message: string, tree: Oid, parents: Array<any>): Promise<Oid>;
  }

  /**
   * Represents credentials used in a commit.
   */
  export class Cred {
    /**
     * Generates SSH credentials for the given account.
     */
    static sshKeyFromAgent(name: string): Cred;
  }

  /**
   * Index of the repository's contents
   */
  export class Index {
    /**
     * Adds a new file to the repository index.
     * @param path the path to the file
     */
    addByPath(path: string): number;

    /**
     * Writes the index.
     * Returns 0 on success.
     */
    write(): number;

    /**
     * Writes the tree.
     * Returns the Oid of the tree.
     */
    writeTree(): Promise<Oid>;
  }

  /**
   * A remote in Git.
   */
  export class Remote {
    /**
     * Performs a Git push.
     * Returns an error code or 0.
     * @param refSpecs specifies the ref to push.
     * @param options configurations to the push.
     */
    push(refSpecs: string[], options: PushOptions): Promise<number>;

    /**
     * Configures the default callbacks for the remote.
     * @param cbs the callbacks to add.
     */
    setCallbacks(cbs: RemoteCallbacks): void;

    /**
     * Connects to the remote.
     * @param dir which way to connect
     */
    connect(dir: Enums.DIRECTION):
  }

  /**
   * TODO
   */
  export class Reference {
    /**
     * Consume a name, and returns the corresponding Oid from a given repository.
     * @param repo the repository to search
     * @param name the reference to find the OID of
     */
    static nameToId(repo: Repository, name: string): Promise<Oid>
  }

  /**
   * An identifier.
   */
  export class Oid { }

  /**
   * Configure a push.
   */
  interface PushOptions {
    callbacks?: RemoteCallbacks;
    customHeaders?: Array<string>;
    proxyOpts?: ProxyOptions;
    pbParallelism?: number;
    version?: number;
  }

  /**
   * Defines remote callback.
   */
  interface RemoteCallbacks {
    certificateCheck?: Function;
    credentials?: Function;
    payload?: any;
    transferProgress?: Function;
    transport?: Function;
    version?: number;
  }

  /**
   * Defines proxy options.
   */
  interface ProxyOptions {
    certificateCheck?: Function;
    credentials?: Function;
    payload?: any;
    type?: number;
    url?: string;
    version?: number;
  }

  /**
   * Callback for transport certificates.
   */
}
