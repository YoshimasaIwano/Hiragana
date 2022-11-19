# ■mnister
You can easily make AI recognize the numbers you wrote.
The execution environment of mnister can be executed on Google Colab or Local PC.

![Design](https://user-images.githubusercontent.com/69660581/93613488-e4e4b700-fa0b-11ea-807d-8a38d6c91363.png)

## ☁：When running on Google Colab
see -> https://github.com/PoodleMaster/mnister/blob/master/mnister.ipynb

### 1. Requirements
- flask_ngrok 

### 2. Build Python Environment
Load **'mnister.ipynb'** in Google Colab and execute all cells.

### 3. Install mnister:
```ipynb
!git clone https://github.com/PoodleMaster/mnister.git
```

### 4. Install python libraries:
```ipynb
%cd mnister
!pip install flask_ngrok
```

### 5. Usage
Start the server and client.

#### (1) Server startup
```ipynb
!python server.py --colab
```

#### (2) Client startup 
Start your browser and access the following URL:(http://xxxxxxxxxxxx.ngrok.io)

### 6. Execution Sample
![mnister sample ngrok](https://user-images.githubusercontent.com/69660581/93540466-b4ab0300-f98e-11ea-843b-6399cdbce4c2.gif)

## 💻：When running on Local PC

### 1. Requirements
- Anaconda : 3
- Python : 3.7
- Tensorflow : 2.3.0 (Please use the same version as when you created the model.)
- flask pillow matplotlib
- flask_ngrok 

### 2. Build Python Environment
```cmd
c:\>conda create -n mnister37 python=3.7
c:\>conda activate mnister37
```

### 3. Install mnister
```cmd
(mnister37) c:\>git clone https://github.com/PoodleMaster/mnister.git
```

### 4. Install python libraries
```cmd
(mnister37) c:\>cd mnister
(mnister37) c:\mnister>conda install flask pillow matplotlib
(mnister37) c:\mnister>pip install tensorflow==2.3.0
(mnister37) c:\mnister>pip install flask_ngrok
```
- Use the same version of Tensorflow as when you created the model.
- The Tensorflow version of the included model is 2.3.0.

### 5. Usage
Start the server and client.

#### (1) Server startup
```cmd
(mnister37) c:\mnister>python server.py
```
#### (2) Client startup 
Start your browser and access the following URL:(http://127.0.0.1:5000)

### 6. Execution Sample
![mnister sample localhost](https://user-images.githubusercontent.com/69660581/93540433-9d6c1580-f98e-11ea-97e0-ec2d3b98326a.gif)

# ■【Extra】ImageDataGenerator model
A generalized version created by [MNIST_ImageDataGenerator](https://github.com/PoodleMaster/MNIST_ImageDataGenerator) is attached.
Swap the models and play around with the difference in recognition rates.

```
The ImageDataGenerator model can be found at "[mnister/Extra/colab_mnist.hdf5]".
Replace it with "[mnister/Extra/colab_mnist.hdf5] → [mnister/colab_mnist.hdf5]".
```

# ■Sample
Please access the following URL.

URL：https://mnister-web.herokuapp.com/

# ■Contributing
Contributions, issues and feature requests are welcome.

# ■Author
- Github: [PoodleMaster](https://github.com/PoodleMaster)

# ■License
Check the LICENSE file.
