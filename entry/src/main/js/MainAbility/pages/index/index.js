import sensor from '@system.sensor';
import http from '@ohos.net.http';

export default {
    data: {
        Sensor: ''
    },

    onInit() {
        console.log('onInit执行');
    },
    onShow() {
        console.log('onShow执行');
        this.subscribeHeartRateSensor();
    },
    onDestroy() {
        console.log('onDestroy执行');
        sensor.unsubscribeHeartRate();
    },

    subscribeHeartRateSensor() {
        sensor.subscribeHeartRate({
            success: (ret) => {
                this.Sensor = ret.heartRate;
                console.log("Success: " + ret.heartRate);
                this.sendHeartRate(ret.heartRate);
            },
            fail: () => {
                console.log("fail");
            }
        });
    },

    sendHeartRate(heartRate) {
        let url = 'http://localhost:8080/oldperson_health';
        let data = {
            oldperson_id: 1,
            heart_rate: heartRate
        };

        let httpRequest;
        try {
            httpRequest = http.createHttp();
        } catch (error) {
            console.log(error);
            return; // 如果创建请求对象失败，直接返回
        }

        httpRequest.request(url, {
            method: http.RequestMethod.POST,
            header: {
                'Content-Type': 'application/json'
            },
            extraData: JSON.stringify(data),
            connectTimeout: 60000,
            readTimeout: 60000,
        }, (err, data) => {
            console.log("2: Inside request callback");
            if (!err) {
                console.log("Heart rate sent successfully: " + data.result);
            } else {
                console.error("Error sending heart rate: " + JSON.stringify(err));
            }
            httpRequest.destroy();
        });

        httpRequest.on("finished", () => {
            console.log("HTTP request finished.");
        });
    }
}
