export class Real{
    /*A dimension of real type.*/
    constructor(low, high){
        this.low = low
        this.high = high
    }

    random_sample(){
        /* Returns a uniformly sampled value from the space */
        return Math.random()*(this.high - this.low) + this.low
    }
}

export class Space{
    constructor(dimensions){
        this.dims = dimensions
    }
    
    random_samples(n){
        /*Sample n points from space at random.*/
        
        var X = []
        for(var i = 0; i < n; i++){
            var x = []
            for(var dim of this.dims){
                x.push(dim.random_sample())
            }
            X.push(x)
        }
        return X
    }
}

export class SpaceException{
    constructor(message){
        this.message = message
    }
    toString(){
        return this.message
    }
}

export function to_space(space_object){
    /*Converts object to Space instance. Object can be at
    least two options:
    1. object is instance of Space, which is then returned
    2. object is list of dimensions, which is then converted
    to instance of Space and returned.*/

    // check if list of dimensions
    if(space_object instanceof Array){
        return new Space(space_object)
    }

    if(space_object instanceof Space){
        return space_object
    }

    throw new SpaceException('Unknown space definition')
}

export class RandomOptimizer{
    /*Performs optimization simply by randomly sampling
    points from space.
    Often very competitive in practice.*/
    constructor(space){
        this.space = to_space(space)
        this.X = []
        this.Y = []
        this.best_x = null
        this.best_y = null
    }

    ask(n=null){
        /* Returns the next n points to try */
        // if n is not specified, return a single point verbatium
        if(n == null){
            return this.space.random_samples(1)[0]
        }

        // return array of points
        return this.space.random_samples(n)
    }

    tell(X, Y){
        /* Record new observed points. 
        Do not really need to do it for random sampling.*/
        
        for(var i = 0; i < X.length; i++){
            if(this.best_y == null || Y[i] < this.best_y){
                this.best_y = Y[i]
                this.best_x = X[i]
            }
        }

        // record observations
        this.X = this.X.concat(X)
        this.Y = this.Y.concat(Y)

        // create the optimization result object
    }

}

export function dummy_minimize(func, dims, n_calls=64){
    var opt = new RandomOptimizer(dims);

    for(var iter=0; iter < n_calls; iter++){
        var x = opt.ask()
        var y = func(x)
        opt.tell([x], [y])
    }

    return opt
}