import sys
import json
def env_to_json(file_path):
    environment_variables = []
    with open(file_path) as f:
        lines = f.readlines()
        for line in lines:
            key, value = line.split('=')
            value = value.replace('\n', '')
            env = {"name": key, "value":value}
            environment_variables.append(env)
    with open("env.json", mode='wt', encoding='utf-8') as f:
        json.dump({"environment":environment_variables}, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        env_to_json(file_path)
    else:
        print('file pathを指定してください。')